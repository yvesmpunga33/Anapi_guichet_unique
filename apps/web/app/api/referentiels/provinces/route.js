import { NextResponse } from 'next/server';
import { Province } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des provinces
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const activeOnly = searchParams.get('activeOnly') === 'true';

    // Build where clause
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
        { capital: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (activeOnly) {
      where.isActive = true;
    }

    const provinces = await Province.findAll({
      where,
      order: [['name', 'ASC']],
    });

    // Calculate stats
    const stats = {
      total: provinces.length,
      totalPopulation: provinces.reduce((sum, p) => sum + (p.population || 0), 0),
      totalArea: provinces.reduce((sum, p) => sum + (p.area || 0), 0),
      active: provinces.filter(p => p.isActive).length,
    };

    return NextResponse.json({ provinces, stats });
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des provinces', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Creer une nouvelle province
export async function POST(request) {
  try {
    const data = await request.json();

    // Validation
    if (!data.code || !data.name) {
      return NextResponse.json(
        { error: 'Le code et le nom sont requis' },
        { status: 400 }
      );
    }

    // Verifier si le code existe deja
    const existingProvince = await Province.findOne({
      where: { code: data.code.toUpperCase() },
    });

    if (existingProvince) {
      return NextResponse.json(
        { error: 'Une province avec ce code existe deja' },
        { status: 400 }
      );
    }

    const province = await Province.create({
      code: data.code.toUpperCase(),
      name: data.name,
      capital: data.capital || null,
      population: data.population ? parseInt(data.population) : null,
      area: data.area ? parseFloat(data.area) : null,
      isActive: data.isActive !== false,
    });

    return NextResponse.json({ province }, { status: 201 });
  } catch (error) {
    console.error('Error creating province:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de la province', details: error.message },
      { status: 500 }
    );
  }
}
