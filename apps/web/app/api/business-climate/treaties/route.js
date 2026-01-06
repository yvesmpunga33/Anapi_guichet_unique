import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { InternationalTreaty, User } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET /api/business-climate/treaties - List all treaties
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
    const treatyType = searchParams.get('treatyType');
    const country = searchParams.get('country');
    const search = searchParams.get('search');

    const where = {};

    if (status) where.status = status;
    if (treatyType) where.treatyType = treatyType;

    if (country) {
      where.partnerCountries = { [Op.contains]: [country] };
    }

    if (search) {
      where[Op.or] = [
        { reference: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { officialName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await InternationalTreaty.findAndCountAll({
      where,
      include: [
        { model: User, as: 'responsible', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
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
    console.error('Error fetching treaties:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des traités', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/business-climate/treaties - Create a new treaty
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      officialName,
      treatyType,
      partnerCountries,
      signedDate,
      effectiveDate,
      expirationDate,
      summary,
      keyProvisions,
      investorBenefits,
      coverageSectors,
      disputeResolutionMechanism,
      responsibleOfficerId,
      documentUrl,
      attachments,
    } = body;

    // Generate reference
    const year = new Date().getFullYear();
    const count = await InternationalTreaty.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(year, 0, 1),
          [Op.lt]: new Date(year + 1, 0, 1),
        },
      },
    });
    const reference = `TRT-${year}-${String(count + 1).padStart(4, '0')}`;

    const treaty = await InternationalTreaty.create({
      reference,
      title,
      officialName,
      treatyType,
      partnerCountries: partnerCountries || [],
      status: effectiveDate && new Date(effectiveDate) <= new Date() ? 'IN_FORCE' : 'SIGNED',
      signedDate,
      effectiveDate,
      expirationDate,
      summary,
      keyProvisions: keyProvisions || [],
      investorBenefits: investorBenefits || [],
      coverageSectors: coverageSectors || [],
      disputeResolutionMechanism,
      responsibleOfficerId,
      documentUrl,
      attachments: attachments || [],
      createdById: session.user.id,
    });

    return NextResponse.json(treaty, { status: 201 });
  } catch (error) {
    console.error('Error creating treaty:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du traité', details: error.message },
      { status: 500 }
    );
  }
}
