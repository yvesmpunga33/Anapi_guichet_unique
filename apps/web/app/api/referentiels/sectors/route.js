import { NextResponse } from 'next/server';
import { Sector } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des secteurs
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    const parentId = searchParams.get('parentId');

    const where = {};

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    if (parentId === 'null') {
      where.parentId = null;
    } else if (parentId) {
      where.parentId = parentId;
    }

    const sectors = await Sector.findAll({
      where,
      include: [
        { model: Sector, as: 'parent', attributes: ['id', 'code', 'name'] },
        { model: Sector, as: 'subSectors', attributes: ['id', 'code', 'name'] },
      ],
      order: [['code', 'ASC']],
    });

    return NextResponse.json({ sectors });
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des secteurs' },
      { status: 500 }
    );
  }
}

// POST - Creer un secteur
export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name || !data.code) {
      return NextResponse.json(
        { error: 'Nom et code sont requis' },
        { status: 400 }
      );
    }

    // Verifier l'unicite du code
    const existing = await Sector.findOne({ where: { code: data.code } });
    if (existing) {
      return NextResponse.json(
        { error: 'Un secteur avec ce code existe deja' },
        { status: 400 }
      );
    }

    const sector = await Sector.create(data);

    return NextResponse.json({ sector }, { status: 201 });
  } catch (error) {
    console.error('Error creating sector:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du secteur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour un secteur
export async function PUT(request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: 'ID du secteur requis' },
        { status: 400 }
      );
    }

    const sector = await Sector.findByPk(data.id);
    if (!sector) {
      return NextResponse.json(
        { error: 'Secteur non trouve' },
        { status: 404 }
      );
    }

    // Verifier l'unicite du code si modifie
    if (data.code && data.code !== sector.code) {
      const existing = await Sector.findOne({ where: { code: data.code } });
      if (existing) {
        return NextResponse.json(
          { error: 'Un secteur avec ce code existe deja' },
          { status: 400 }
        );
      }
    }

    await sector.update(data);

    return NextResponse.json({ sector });
  } catch (error) {
    console.error('Error updating sector:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour du secteur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un secteur
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID du secteur requis' },
        { status: 400 }
      );
    }

    const sector = await Sector.findByPk(id);
    if (!sector) {
      return NextResponse.json(
        { error: 'Secteur non trouve' },
        { status: 404 }
      );
    }

    await sector.destroy();

    return NextResponse.json({ message: 'Secteur supprime avec succes' });
  } catch (error) {
    console.error('Error deleting sector:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du secteur' },
      { status: 500 }
    );
  }
}
