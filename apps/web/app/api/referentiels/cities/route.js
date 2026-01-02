import { NextResponse } from 'next/server';
import { City, Province } from '../../../../models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// GET - Liste des villes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const provinceId = searchParams.get('provinceId');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    // Build where clause
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (provinceId) {
      where.provinceId = provinceId;
    }

    if (activeOnly) {
      where.isActive = true;
    }

    const cities = await City.findAll({
      where,
      include: [
        {
          model: Province,
          as: 'province',
          attributes: ['id', 'code', 'name'],
        },
      ],
      order: [['name', 'ASC']],
    });

    // Calculate stats
    const stats = {
      total: cities.length,
      totalPopulation: cities.reduce((sum, c) => sum + (c.population || 0), 0),
      capitals: cities.filter(c => c.isCapital).length,
      active: cities.filter(c => c.isActive).length,
    };

    return NextResponse.json({ cities, stats });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des villes', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Creer une nouvelle ville
export async function POST(request) {
  try {
    const data = await request.json();

    // Validation
    if (!data.code || !data.name || !data.provinceId) {
      return NextResponse.json(
        { error: 'Le code, le nom et la province sont requis' },
        { status: 400 }
      );
    }

    // Verifier si la province existe
    const province = await Province.findByPk(data.provinceId);
    if (!province) {
      return NextResponse.json(
        { error: 'Province non trouvee' },
        { status: 400 }
      );
    }

    // Verifier si le code existe deja dans cette province
    const existingCity = await City.findOne({
      where: {
        code: data.code.toUpperCase(),
        provinceId: data.provinceId,
      },
    });

    if (existingCity) {
      return NextResponse.json(
        { error: 'Une ville avec ce code existe deja dans cette province' },
        { status: 400 }
      );
    }

    const city = await City.create({
      id: uuidv4(),
      code: data.code.toUpperCase(),
      name: data.name,
      provinceId: data.provinceId,
      population: data.population ? parseInt(data.population) : null,
      isCapital: data.isCapital === true,
      isActive: data.isActive !== false,
    });

    // Reload with province
    await city.reload({
      include: [
        { model: Province, as: 'province', attributes: ['id', 'code', 'name'] },
      ],
    });

    return NextResponse.json({ city }, { status: 201 });
  } catch (error) {
    console.error('Error creating city:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de la ville', details: error.message },
      { status: 500 }
    );
  }
}
