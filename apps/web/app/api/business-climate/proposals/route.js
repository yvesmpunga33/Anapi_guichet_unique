import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import {
  LegalProposal,
  JuridicalText,
  User,
} from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET /api/business-climate/proposals - List all legal proposals
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
    const proposalType = searchParams.get('proposalType');
    const priority = searchParams.get('priority');
    const domain = searchParams.get('domain');
    const search = searchParams.get('search');

    const where = {};

    if (status) where.status = status;
    if (proposalType) where.proposalType = proposalType;
    if (priority) where.priority = priority;
    if (domain) where.domain = domain;

    if (search) {
      where[Op.or] = [
        { reference: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { summary: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await LegalProposal.findAndCountAll({
      where,
      include: [
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] },
        { model: JuridicalText, as: 'relatedText', attributes: ['id', 'reference', 'title'] },
      ],
      order: [
        ['priority', 'ASC'],
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
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des propositions', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/business-climate/proposals - Create a new proposal
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      proposalType,
      domain,
      summary,
      fullText,
      justification,
      expectedImpact,
      targetAuthority,
      targetedBarriers,
      relatedTextId,
      priority,
      internalNotes,
      attachments,
    } = body;

    // Generate reference
    const year = new Date().getFullYear();
    const count = await LegalProposal.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(year, 0, 1),
          [Op.lt]: new Date(year + 1, 0, 1),
        },
      },
    });
    const reference = `PROP-${year}-${String(count + 1).padStart(4, '0')}`;

    const proposal = await LegalProposal.create({
      reference,
      title,
      proposalType: proposalType || 'RECOMMENDATION',
      domain: domain || 'INVESTMENT_CODE',
      summary,
      fullText,
      justification,
      expectedImpact,
      status: 'DRAFT',
      priority: priority || 'MEDIUM',
      targetAuthority,
      targetedBarriers: targetedBarriers || [],
      relatedTextId,
      internalNotes,
      attachments: attachments || [],
      createdById: session.user.id,
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la proposition', details: error.message },
      { status: 500 }
    );
  }
}
