import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { ApprovalRequest, Investor, Investment, User } from '../../../../models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// Generer un numero de demande unique
async function generateRequestNumber() {
  const year = new Date().getFullYear();
  const prefix = 'AGR';

  // Trouver le dernier numero de l'annee
  const lastRequest = await ApprovalRequest.findOne({
    where: {
      requestNumber: {
        [Op.like]: `${prefix}-${year}-%`
      }
    },
    order: [['requestNumber', 'DESC']]
  });

  let nextNumber = 1;
  if (lastRequest) {
    const parts = lastRequest.requestNumber.split('-');
    const lastNumber = parseInt(parts[2], 10);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}-${year}-${String(nextNumber).padStart(5, '0')}`;
}

// GET - Liste des demandes d'agrement avec pagination et filtres
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const approvalType = searchParams.get('type');
    const province = searchParams.get('province');
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (search) {
      where[Op.or] = [
        { requestNumber: { [Op.iLike]: `%${search}%` } },
        { projectName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (approvalType) {
      where.approvalType = approvalType;
    }

    if (province) {
      where.province = province;
    }

    const { count, rows: agrements } = await ApprovalRequest.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // Calculate stats
    const stats = await ApprovalRequest.findAll({
      attributes: [
        'status',
        [ApprovalRequest.sequelize.fn('COUNT', ApprovalRequest.sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    const statsMap = {
      total: count,
      draft: 0,
      submitted: 0,
      inReview: 0,
      approved: 0,
      rejected: 0,
    };

    stats.forEach((s) => {
      switch (s.status) {
        case 'DRAFT':
          statsMap.draft = parseInt(s.count);
          break;
        case 'SUBMITTED':
          statsMap.submitted = parseInt(s.count);
          break;
        case 'IN_REVIEW':
          statsMap.inReview = parseInt(s.count);
          break;
        case 'APPROVED':
          statsMap.approved = parseInt(s.count);
          break;
        case 'REJECTED':
          statsMap.rejected = parseInt(s.count);
          break;
      }
    });

    return NextResponse.json({
      data: agrements,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
      stats: statsMap,
    });
  } catch (error) {
    console.error('Error fetching agrements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des agrements' },
      { status: 500 }
    );
  }
}

// POST - Creer une nouvelle demande d'agrement
export async function POST(request) {
  try {
    const session = await auth();
    const data = await request.json();

    // Generer le numero de demande
    const requestNumber = await generateRequestNumber();

    // Creer ou trouver l'investisseur
    let investor = null;
    if (data.investorId) {
      investor = await Investor.findByPk(data.investorId);
    } else if (data.investorName) {
      // Creer un nouvel investisseur
      const investorCode = `INV-${Date.now().toString(36).toUpperCase()}`;
      investor = await Investor.create({
        investorCode,
        name: data.investorName,
        type: data.investorType || 'company',
        email: data.email,
        phone: data.phone,
        province: data.investorProvince,
        city: data.investorCity,
        address: data.investorAddress,
        country: data.investorCountry || 'RDC',
        rccm: data.rccm,
        idNat: data.idNat,
        nif: data.nif,
        status: 'PENDING',
        createdById: session?.user?.id || null,
      });
    }

    // S'assurer que l'investisseur existe
    if (!investor) {
      return NextResponse.json(
        { error: 'Erreur lors de la creation de l\'investisseur' },
        { status: 400 }
      );
    }

    // Creer la demande d'agrement
    const agrement = await ApprovalRequest.create({
      id: uuidv4(),
      requestNumber,
      investorId: investor.id.toString(), // Convertir UUID en string pour la colonne TEXT
      approvalType: data.approvalType,
      regime: data.regime,
      projectName: data.projectName,
      projectDescription: data.projectDescription,
      investmentAmount: parseFloat(String(data.investmentAmount).replace(/[^0-9.-]/g, '')) || 0,
      currency: data.currency || 'USD',
      jobsToCreate: (parseInt(data.directJobs) || 0) + (parseInt(data.indirectJobs) || 0),
      directJobs: parseInt(data.directJobs) || 0,
      indirectJobs: parseInt(data.indirectJobs) || 0,
      province: data.projectProvince,
      sector: data.sector,
      status: data.isDraft ? 'DRAFT' : 'SUBMITTED',
      submittedAt: data.isDraft ? null : new Date(),
    });

    return NextResponse.json({
      success: true,
      agrement,
      investor,
      message: data.isDraft
        ? 'Brouillon enregistre avec succes'
        : 'Demande soumise avec succes',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating agrement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de la demande', details: error.message },
      { status: 500 }
    );
  }
}
