import { NextResponse } from 'next/server';
import { Commune, City, Province } from '../../../../models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

// GET - Liste des communes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const cityId = searchParams.get('cityId');
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

    if (cityId) {
      where.cityId = cityId;
    }

    if (activeOnly) {
      where.isActive = true;
    }

    // Build include for filtering by province
    const includeOptions = [
      {
        model: City,
        as: 'city',
        attributes: ['id', 'code', 'name'],
        include: [
          {
            model: Province,
            as: 'province',
            attributes: ['id', 'code', 'name'],
          },
        ],
      },
    ];

    // If provinceId is specified, filter cities by province
    if (provinceId) {
      includeOptions[0].where = { provinceId };
      includeOptions[0].required = true;
    }

    const communes = await Commune.findAll({
      where,
      include: includeOptions,
      order: [['name', 'ASC']],
    });

    // Calculate stats
    const stats = {
      total: communes.length,
      totalPopulation: communes.reduce((sum, c) => sum + (c.population || 0), 0),
      active: communes.filter(c => c.isActive).length,
    };

    return NextResponse.json({ communes, stats });
  } catch (error) {
    console.error('Error fetching communes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des communes', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Creer une nouvelle commune
export async function POST(request) {
  try {
    const data = await request.json();

    // Validation
    if (!data.code || !data.name || !data.cityId) {
      return NextResponse.json(
        { error: 'Le code, le nom et la ville sont requis' },
        { status: 400 }
      );
    }

    // Verifier si la ville existe
    const city = await City.findByPk(data.cityId);
    if (!city) {
      return NextResponse.json(
        { error: 'Ville non trouvee' },
        { status: 400 }
      );
    }

    // Verifier si le code existe deja dans cette ville
    const existingCommune = await Commune.findOne({
      where: {
        code: data.code.toUpperCase(),
        cityId: data.cityId,
      },
    });

    if (existingCommune) {
      return NextResponse.json(
        { error: 'Une commune avec ce code existe deja dans cette ville' },
        { status: 400 }
      );
    }

    const commune = await Commune.create({
      id: uuidv4(),
      code: data.code.toUpperCase(),
      name: data.name,
      cityId: data.cityId,
      population: data.population ? parseInt(data.population) : null,
      isActive: data.isActive !== false,
    });

    // Reload with city
    await commune.reload({
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'code', 'name'],
          include: [
            { model: Province, as: 'province', attributes: ['id', 'code', 'name'] },
          ],
        },
      ],
    });

    return NextResponse.json({ commune }, { status: 201 });
  } catch (error) {
    console.error('Error creating commune:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de la commune', details: error.message },
      { status: 500 }
    );
  }
}
