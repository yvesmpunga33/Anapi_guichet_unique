import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import {
  BusinessBarrier,
  BarrierResolution,
  Investor,
  Investment,
  User,
} from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET /api/business-climate/barriers - List all barriers
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
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const sector = searchParams.get('sector');
    const search = searchParams.get('search');

    const where = {};

    if (status) where.status = status;
    if (category) where.category = category;
    if (priority) where.severity = priority;
    if (sector) where.sector = sector;

    if (search) {
      where[Op.or] = [
        { reference: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await BusinessBarrier.findAndCountAll({
      where,
      include: [
        { model: Investor, as: 'investor', attributes: ['id', 'name', 'country'] },
        { model: Investment, as: 'project', attributes: ['id', 'projectCode', 'projectName'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
      ],
      order: [
        ['severity', 'ASC'],
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
    console.error('Error fetching barriers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des obstacles', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/business-climate/barriers - Create a new barrier
export async function POST(request) {
  try {
    const session = await auth();
    console.log('[Barriers API] Session:', session?.user?.id, session?.user?.email);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await request.json();
    const {
      title,
      description,
      category,
      subCategory,
      priority,
      sector,
      province,
      investorId,
      projectId,
      administrationConcerned,
      contactPerson,
      contactEmail,
      contactPhone,
      estimatedImpact,
      impactDetails,
      evidenceUrls,
    } = body;

    // Generate reference
    const year = new Date().getFullYear();
    const count = await BusinessBarrier.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(year, 0, 1),
          [Op.lt]: new Date(year + 1, 0, 1),
        },
      },
    });
    const reference = `OBS-${year}-${String(count + 1).padStart(4, '0')}`;

    const barrier = await BusinessBarrier.create({
      reference,
      title,
      description,
      category,
      severity: priority || 'MEDIUM',
      status: 'REPORTED',
      sector,
      province,
      investorId: investorId || null,
      projectId: projectId || null,
      concernedAdministration: administrationConcerned,
      reporterName: contactPerson,
      reporterEmail: contactEmail,
      reporterPhone: contactPhone,
      estimatedImpact: estimatedImpact ? parseFloat(estimatedImpact) : null,
      internalNotes: impactDetails,
      attachments: evidenceUrls || [],
      createdById: userId,
      reportedAt: new Date(),
    });

    // Create initial resolution entry
    await BarrierResolution.create({
      barrierId: barrier.id,
      actionType: 'STATUS_CHANGE',
      description: 'Obstacle signalé et enregistré dans le système',
      newStatus: 'REPORTED',
      performedById: userId,
      actionDate: new Date(),
    });

    return NextResponse.json(barrier, { status: 201 });
  } catch (error) {
    console.error('Error creating barrier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'obstacle', details: error.message },
      { status: 500 }
    );
  }
}
