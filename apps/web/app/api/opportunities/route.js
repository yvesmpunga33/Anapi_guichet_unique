import { NextResponse } from 'next/server';
import { ProvinceOpportunity, Province, Sector, OpportunityDocument, User } from '../../../models/index.js';
import { Op } from 'sequelize';
import { auth } from '../../lib/auth.js';

// GET - Liste des opportunites d'investissement
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const provinceId = searchParams.get('provinceId');
    const sectorId = searchParams.get('sectorId');
    const status = searchParams.get('status');
    const isFeatured = searchParams.get('isFeatured');
    const minInvestment = searchParams.get('minInvestment');
    const maxInvestment = searchParams.get('maxInvestment');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { reference: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (provinceId) {
      where.provinceId = provinceId;
    }

    if (sectorId) {
      where.sectorId = sectorId;
    }

    if (status) {
      where.status = status;
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (minInvestment) {
      where.minInvestment = { [Op.gte]: parseFloat(minInvestment) };
    }

    if (maxInvestment) {
      where.maxInvestment = { [Op.lte]: parseFloat(maxInvestment) };
    }

    const { count, rows: opportunities } = await ProvinceOpportunity.findAndCountAll({
      where,
      include: [
        {
          model: Province,
          as: 'province',
          attributes: ['id', 'code', 'name', 'capital'],
        },
        {
          model: Sector,
          as: 'sector',
          attributes: ['id', 'code', 'name', 'color'],
        },
        {
          model: OpportunityDocument,
          as: 'requiredDocuments',
          attributes: ['id', 'name', 'isRequired', 'category'],
        },
      ],
      order: [
        ['isFeatured', 'DESC'],
        ['createdAt', 'DESC'],
      ],
      limit,
      offset,
    });

    // Calculate stats
    const stats = {
      total: count,
      published: await ProvinceOpportunity.count({ where: { status: 'PUBLISHED' } }),
      draft: await ProvinceOpportunity.count({ where: { status: 'DRAFT' } }),
      closed: await ProvinceOpportunity.count({ where: { status: 'CLOSED' } }),
      featured: await ProvinceOpportunity.count({ where: { isFeatured: true } }),
    };

    return NextResponse.json({
      opportunities,
      stats,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des opportunites', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Creer une nouvelle opportunite
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const data = await request.json();

    // Validation
    if (!data.title || !data.provinceId) {
      return NextResponse.json(
        { error: 'Le titre et la province sont requis' },
        { status: 400 }
      );
    }

    // Generate reference
    const year = new Date().getFullYear();
    const count = await ProvinceOpportunity.count();
    const reference = `OPP-${year}-${String(count + 1).padStart(4, '0')}`;

    const opportunity = await ProvinceOpportunity.create({
      reference,
      title: data.title,
      description: data.description || null,
      provinceId: data.provinceId,
      sectorId: data.sectorId || null,
      minInvestment: data.minInvestment ? parseFloat(data.minInvestment) : null,
      maxInvestment: data.maxInvestment ? parseFloat(data.maxInvestment) : null,
      expectedJobs: data.expectedJobs ? parseInt(data.expectedJobs) : null,
      projectDuration: data.projectDuration || null,
      location: data.location || null,
      advantages: data.advantages ? JSON.stringify(data.advantages) : null,
      requirements: data.requirements ? JSON.stringify(data.requirements) : null,
      contactName: data.contactName || null,
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      deadline: data.deadline || null,
      status: data.status || 'DRAFT',
      priority: data.priority || 'MEDIUM',
      isFeatured: data.isFeatured || false,
      imageUrl: data.imageUrl || null,
      createdById: session.user.id,
    });

    // Create required documents if provided
    if (data.requiredDocuments && Array.isArray(data.requiredDocuments)) {
      for (let i = 0; i < data.requiredDocuments.length; i++) {
        const doc = data.requiredDocuments[i];
        await OpportunityDocument.create({
          opportunityId: opportunity.id,
          name: doc.name,
          description: doc.description || null,
          isRequired: doc.isRequired !== false,
          category: doc.category || 'OTHER',
          templateUrl: doc.templateUrl || null,
          sortOrder: i,
        });
      }
    }

    // Fetch the created opportunity with associations
    const createdOpportunity = await ProvinceOpportunity.findByPk(opportunity.id, {
      include: [
        { model: Province, as: 'province' },
        { model: Sector, as: 'sector' },
        { model: OpportunityDocument, as: 'requiredDocuments' },
      ],
    });

    return NextResponse.json({ opportunity: createdOpportunity }, { status: 201 });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de l\'opportunite', details: error.message },
      { status: 500 }
    );
  }
}
