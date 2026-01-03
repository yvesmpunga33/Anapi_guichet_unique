import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Bidder, BidderDocument, Country, Province, City, User, sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des soumissionnaires
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const offset = (page - 1) * limit;

    const where = {};

    // Recherche
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { companyName: { [Op.iLike]: `%${search}%` } },
        { rccm: { [Op.iLike]: `%${search}%` } },
        { nif: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;

    const { count, rows } = await Bidder.findAndCountAll({
      where,
      include: [
        {
          model: Country,
          as: 'country',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: Province,
          as: 'province',
          attributes: ['id', 'code', 'name'],
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'code', 'name'],
        },
      ],
      order: [['companyName', 'ASC']],
      limit,
      offset,
    });

    // Stats par statut
    const [statusStats] = await sequelize.query(`
      SELECT status, COUNT(*) as count
      FROM procurement_bidders
      GROUP BY status
    `);

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
      stats: {
        byStatus: statusStats,
      },
    });

  } catch (error) {
    console.error('Error fetching bidders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des soumissionnaires', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Creer un soumissionnaire
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();

    // Generer le code automatiquement
    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) as count FROM procurement_bidders
    `);
    const count = parseInt(countResult[0]?.count || 0) + 1;
    const code = body.code || `ENT-${String(count).padStart(5, '0')}`;

    // Verifier l'unicite du RCCM et NIF
    if (body.rccm) {
      const existingRccm = await Bidder.findOne({ where: { rccm: body.rccm } });
      if (existingRccm) {
        return NextResponse.json(
          { error: 'Un soumissionnaire avec ce RCCM existe deja' },
          { status: 400 }
        );
      }
    }

    if (body.nif) {
      const existingNif = await Bidder.findOne({ where: { nif: body.nif } });
      if (existingNif) {
        return NextResponse.json(
          { error: 'Un soumissionnaire avec ce NIF existe deja' },
          { status: 400 }
        );
      }
    }

    const bidder = await Bidder.create({
      ...body,
      code,
      createdById: session.user.id,
      status: body.status || 'ACTIVE',
    });

    const result = await Bidder.findByPk(bidder.id, {
      include: [
        { model: Country, as: 'country' },
        { model: Province, as: 'province' },
        { model: City, as: 'city' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Soumissionnaire cree avec succes',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating bidder:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du soumissionnaire', details: error.message },
      { status: 500 }
    );
  }
}
