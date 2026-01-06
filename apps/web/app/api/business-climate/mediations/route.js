import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import {
  MediationCase,
  BusinessBarrier,
  Investor,
  Investment,
  User,
} from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET /api/business-climate/mediations - List all mediation cases
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');
    const disputeType = searchParams.get('disputeType');
    const urgencyLevel = searchParams.get('urgencyLevel');
    const search = searchParams.get('search');

    const where = {};

    if (status) where.status = status;
    if (disputeType) where.disputeType = disputeType;
    if (urgencyLevel) where.priority = urgencyLevel;

    if (search) {
      where[Op.or] = [
        { reference: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { investorClaim: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await MediationCase.findAndCountAll({
      where,
      include: [
        { model: Investor, as: 'investor', attributes: ['id', 'name', 'country'] },
        { model: Investment, as: 'project', attributes: ['id', 'projectCode', 'projectName'] },
        { model: User, as: 'mediator', attributes: ['id', 'name', 'email'] },
        { model: BusinessBarrier, as: 'barrier', attributes: ['id', 'reference', 'title'] },
      ],
      order: [
        ['priority', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit,
      offset: (page - 1) * limit,
    });

    return NextResponse.json({
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching mediations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des médiations', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/business-climate/mediations - Create a new mediation case
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      disputeType,
      urgencyLevel,
      investorId,
      projectId,
      relatedBarrierId,
      respondentName,
      respondentType,
      respondentContact,
      investorClaim,
      claimAmount,
      claimCurrency,
      respondentPosition,
      mediatorId,
      hearingDate,
      hearingLocation,
    } = body;

    // Generate reference
    const year = new Date().getFullYear();
    const count = await MediationCase.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(year, 0, 1),
          [Op.lt]: new Date(year + 1, 0, 1),
        },
      },
    });
    const reference = `MED-${year}-${String(count + 1).padStart(4, '0')}`;

    // Use investorClaim as description if description is not provided
    const mediationDescription = description || investorClaim || 'Cas de médiation';

    const mediation = await MediationCase.create({
      reference,
      title,
      description: mediationDescription,
      disputeType,
      status: 'SUBMITTED',
      priority: urgencyLevel || 'MEDIUM',
      investorId: investorId || null,
      projectId: projectId || null,
      barrierId: relatedBarrierId || null,
      respondentName,
      respondentType,
      respondentContact,
      disputedAmount: claimAmount ? parseFloat(claimAmount) : null,
      currency: claimCurrency || 'USD',
      internalNotes: respondentPosition || null,
      mediatorId: mediatorId || null,
      firstSessionAt: hearingDate ? new Date(hearingDate) : null,
      createdById: session.user.id,
      submittedAt: new Date(),
    });

    return NextResponse.json(mediation, { status: 201 });
  } catch (error) {
    console.error('Error creating mediation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la médiation', details: error.message },
      { status: 500 }
    );
  }
}
