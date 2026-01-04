import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { ProcurementContract, Bidder, Tender, Ministry, User, sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des contrats
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const year = searchParams.get('year') || '';
    const bidderId = searchParams.get('bidderId') || '';

    const where = {};

    if (search) {
      where[Op.or] = [
        { contractNumber: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { '$contractor.company_name$': { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (year) {
      where[Op.and] = [
        ...(where[Op.and] || []),
        sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "ProcurementContract"."created_at"')), year),
      ];
    }

    if (bidderId) {
      where.bidderId = bidderId;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await ProcurementContract.findAndCountAll({
      where,
      include: [
        {
          model: Bidder,
          as: 'contractor',
          attributes: ['id', 'companyName', 'rccm'],
        },
        {
          model: Tender,
          as: 'tender',
          attributes: ['id', 'reference', 'title'],
          include: [
            { model: Ministry, as: 'ministry', attributes: ['id', 'name', 'shortName'] },
          ],
        },
        { model: User, as: 'signedByClient', attributes: ['id', 'name'] },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      distinct: true,
    });

    // Map contractor to bidder for frontend compatibility
    const mappedRows = rows.map(row => {
      const data = row.toJSON();
      data.bidder = data.contractor;
      delete data.contractor;
      return data;
    });

    return NextResponse.json({
      success: true,
      data: mappedRows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des contrats', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer un contrat
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.title || !body.bidderId) {
      return NextResponse.json(
        { error: 'Le titre et le soumissionnaire sont obligatoires' },
        { status: 400 }
      );
    }

    // Générer le numéro de contrat
    const year = new Date().getFullYear();
    const count = await ProcurementContract.count({
      where: sequelize.where(
        sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "created_at"')),
        year
      ),
    });

    const contractNumber = `PM-${year}-${(count + 1).toString().padStart(4, '0')}`;

    const contract = await ProcurementContract.create({
      contractNumber,
      title: body.title,
      description: body.description || null,
      tenderId: body.tenderId || null,
      bidId: body.bidId || null,
      lotId: body.lotId || null,
      bidderId: body.bidderId,
      contractValue: body.contractValue || null,
      currency: body.currency || 'USD',
      signatureDate: body.signatureDate || null,
      startDate: body.startDate || null,
      endDate: body.endDate || null,
      guaranteeAmount: body.guaranteeAmount || null,
      guaranteeType: body.guaranteeType || null,
      guaranteeEndDate: body.guaranteeEndDate || null,
      paymentTerms: body.paymentTerms || null,
      penaltyRate: body.penaltyRate || null,
      status: body.status || 'DRAFT',
      createdById: session.user.id,
    });

    const result = await ProcurementContract.findByPk(contract.id, {
      include: [
        { model: Bidder, as: 'contractor', attributes: ['id', 'companyName', 'rccm'] },
        { model: Tender, as: 'tender', attributes: ['id', 'reference', 'title'] },
      ],
    });

    // Map contractor to bidder for frontend compatibility
    const mappedResult = result.toJSON();
    mappedResult.bidder = mappedResult.contractor;
    delete mappedResult.contractor;

    return NextResponse.json({
      success: true,
      data: mappedResult,
      message: 'Contrat cree avec succes',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du contrat', details: error.message },
      { status: 500 }
    );
  }
}
