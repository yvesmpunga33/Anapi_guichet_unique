import { NextResponse } from 'next/server';
import { MinistryRequest, MinistryRequestHistory, MinistryWorkflow, Ministry, Investor } from '../../../../models/index.js';
import { Op } from 'sequelize';
import { auth } from '../../../lib/auth.js';

// Générer un numéro de demande
async function generateRequestNumber(requestType) {
  const year = new Date().getFullYear();
  const prefix = requestType === 'AUTORISATION' ? 'AUT' : requestType === 'LICENCE' ? 'LIC' : 'PER';

  const lastRequest = await MinistryRequest.findOne({
    where: {
      requestNumber: {
        [Op.like]: `${prefix}-${year}-%`
      }
    },
    order: [['requestNumber', 'DESC']],
  });

  let nextNumber = 1;
  if (lastRequest) {
    const lastNumber = parseInt(lastRequest.requestNumber.split('-')[2], 10);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}-${year}-${String(nextNumber).padStart(5, '0')}`;
}

// GET - Liste des demandes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;
    const ministryId = searchParams.get('ministryId');
    const requestType = searchParams.get('requestType');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const priority = searchParams.get('priority');

    const where = {};
    if (ministryId) where.ministryId = ministryId;
    if (requestType) where.requestType = requestType;
    if (status && status !== 'all') where.status = status;
    if (priority && priority !== 'all') where.priority = priority;

    if (search) {
      where[Op.or] = [
        { requestNumber: { [Op.iLike]: `%${search}%` } },
        { applicantName: { [Op.iLike]: `%${search}%` } },
        { subject: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await MinistryRequest.findAndCountAll({
      where,
      include: [
        { model: Ministry, as: 'ministry', attributes: ['id', 'name', 'shortName', 'code'] },
        { model: Investor, as: 'investor', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // Calculer les statistiques
    const statsWhere = ministryId ? { ministryId } : {};
    if (requestType) statsWhere.requestType = requestType;

    const stats = await MinistryRequest.findAll({
      where: statsWhere,
      attributes: [
        'status',
        [MinistryRequest.sequelize.fn('COUNT', MinistryRequest.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true,
    });

    const statsObj = {
      total: count,
      draft: 0,
      submitted: 0,
      inProgress: 0,
      pendingDocuments: 0,
      underReview: 0,
      approved: 0,
      rejected: 0,
      pending: 0, // Combined pending statuses
    };

    stats.forEach(s => {
      if (s.status === 'IN_PROGRESS') statsObj.inProgress = parseInt(s.count);
      else if (s.status === 'PENDING_DOCUMENTS') statsObj.pendingDocuments = parseInt(s.count);
      else if (s.status === 'UNDER_REVIEW') statsObj.underReview = parseInt(s.count);
      else if (statsObj[s.status.toLowerCase()] !== undefined) {
        statsObj[s.status.toLowerCase()] = parseInt(s.count);
      }
    });

    // Calculate pending as sum of SUBMITTED, IN_PROGRESS, PENDING_DOCUMENTS, UNDER_REVIEW
    statsObj.pending = statsObj.submitted + statsObj.inProgress + statsObj.pendingDocuments + statsObj.underReview;

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
      stats: statsObj,
    });
  } catch (error) {
    console.error('Error fetching ministry requests:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des demandes', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle demande
export async function POST(request) {
  try {
    const session = await auth();
    const data = await request.json();

    const { ministryId, requestType } = data;

    if (!ministryId || !requestType) {
      return NextResponse.json(
        { error: 'ministryId et requestType sont requis' },
        { status: 400 }
      );
    }

    // Récupérer le nombre d'étapes du workflow
    const workflowSteps = await MinistryWorkflow.count({
      where: { ministryId, requestType, isActive: true }
    });

    const requestNumber = await generateRequestNumber(requestType);

    const ministryRequest = await MinistryRequest.create({
      requestNumber,
      requestType,
      ministryId,
      applicantType: data.applicantType || 'COMPANY',
      applicantName: data.applicantName,
      applicantEmail: data.applicantEmail,
      applicantPhone: data.applicantPhone,
      applicantAddress: data.applicantAddress,
      rccm: data.rccm,
      idNat: data.idNat,
      nif: data.nif,
      subject: data.subject,
      description: data.description,
      sector: data.sector,
      province: data.province,
      city: data.city,
      investmentAmount: data.investmentAmount ? parseFloat(String(data.investmentAmount).replace(/[^0-9.-]/g, '')) : null,
      currency: data.currency || 'USD',
      status: data.isDraft ? 'DRAFT' : 'SUBMITTED',
      currentStep: 1,
      totalSteps: workflowSteps || 1,
      priority: data.priority || 'NORMAL',
      submittedAt: data.isDraft ? null : new Date(),
      investorId: data.investorId || null,
      dossierId: data.dossierId || null,
      createdById: session?.user?.id || null,
    });

    // Créer l'historique
    await MinistryRequestHistory.create({
      requestId: ministryRequest.id,
      stepNumber: 1,
      stepName: 'Creation',
      action: data.isDraft ? 'CREATED' : 'SUBMITTED',
      newStatus: data.isDraft ? 'DRAFT' : 'SUBMITTED',
      performedById: session?.user?.id,
      performedByName: session?.user?.name,
    });

    return NextResponse.json({
      success: true,
      message: data.isDraft ? 'Brouillon enregistre' : 'Demande soumise avec succes',
      data: ministryRequest,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating ministry request:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de la demande', details: error.message },
      { status: 500 }
    );
  }
}
