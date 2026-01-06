import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import {
  ClimateIndicator,
  ClimateIndicatorValue,
} from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET /api/business-climate/indicators - List all indicators
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const category = searchParams.get('category');
    const source = searchParams.get('source');
    const withLatestValue = searchParams.get('withLatestValue') === 'true';
    const search = searchParams.get('search');

    const where = { isActive: true };

    if (category) where.category = category;
    if (source) where.source = source;

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const includeOptions = [];
    if (withLatestValue) {
      includeOptions.push({
        model: ClimateIndicatorValue,
        as: 'values',
        separate: true,
        limit: 1,
        order: [['year', 'DESC'], ['quarter', 'DESC'], ['month', 'DESC']],
      });
    }

    const { count, rows } = await ClimateIndicator.findAndCountAll({
      where,
      include: includeOptions,
      order: [
        ['category', 'ASC'],
        ['displayOrder', 'ASC'],
        ['name', 'ASC']
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
    console.error('Error fetching indicators:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des indicateurs', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/business-climate/indicators - Create a new indicator
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      code,
      name,
      description,
      category,
      subCategory,
      measureType,
      unit,
      source,
      sourceUrl,
      methodology,
      frequency,
      targetValue,
      targetYear,
      benchmarkValue,
      benchmarkCountry,
      displayOrder,
    } = body;

    // Check if code already exists
    const existing = await ClimateIndicator.findOne({ where: { code } });
    if (existing) {
      return NextResponse.json(
        { error: 'Un indicateur avec ce code existe déjà' },
        { status: 400 }
      );
    }

    const indicator = await ClimateIndicator.create({
      code,
      name,
      description,
      category,
      subCategory,
      measureType: measureType || 'NUMBER',
      unit,
      source,
      sourceUrl,
      methodology,
      frequency: frequency || 'ANNUAL',
      targetValue,
      targetYear,
      benchmarkValue,
      benchmarkCountry,
      displayOrder: displayOrder || 0,
      isActive: true,
      createdById: session.user.id,
    });

    return NextResponse.json(indicator, { status: 201 });
  } catch (error) {
    console.error('Error creating indicator:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'indicateur', details: error.message },
      { status: 500 }
    );
  }
}
