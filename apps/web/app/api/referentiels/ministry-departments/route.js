import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { MinistryDepartment, Ministry } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET /api/referentiels/ministry-departments - Liste des départements par ministère
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ministryId = searchParams.get('ministryId');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');

    const where = {};

    // Filtrer par ministère
    if (ministryId) {
      where.ministryId = ministryId;
    }

    // Recherche
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Filtrer par statut
    if (isActive !== null && isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    const departments = await MinistryDepartment.findAll({
      where,
      include: [
        {
          model: Ministry,
          as: 'ministry',
          attributes: ['id', 'code', 'name', 'shortName'],
        },
      ],
      order: [['name', 'ASC']],
    });

    return NextResponse.json({
      success: true,
      data: departments.map(d => d.toJSON()),
    });
  } catch (error) {
    console.error('Error fetching ministry departments:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des departements', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/referentiels/ministry-departments - Créer un département
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.ministryId) {
      return NextResponse.json(
        { error: 'Le ministere est obligatoire' },
        { status: 400 }
      );
    }
    if (!body.name) {
      return NextResponse.json(
        { error: 'Le nom est obligatoire' },
        { status: 400 }
      );
    }

    // Générer le code si non fourni
    let code = body.code;
    if (!code) {
      const ministry = await Ministry.findByPk(body.ministryId);
      const count = await MinistryDepartment.count({ where: { ministryId: body.ministryId } });
      code = `${ministry?.shortName || 'DEP'}-${(count + 1).toString().padStart(3, '0')}`;
    }

    const department = await MinistryDepartment.create({
      code,
      name: body.name,
      description: body.description || null,
      ministryId: body.ministryId,
      headName: body.headName || null,
      headTitle: body.headTitle || null,
      phone: body.phone || null,
      email: body.email || null,
      isActive: body.isActive !== false,
    });

    const result = await MinistryDepartment.findByPk(department.id, {
      include: [
        { model: Ministry, as: 'ministry', attributes: ['id', 'code', 'name', 'shortName'] },
      ],
    });

    return NextResponse.json({
      success: true,
      data: result.toJSON(),
      message: 'Departement cree avec succes',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating ministry department:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du departement', details: error.message },
      { status: 500 }
    );
  }
}
