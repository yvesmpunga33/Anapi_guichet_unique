import { NextResponse } from 'next/server';
import { Ministry } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des ministeres
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    const all = searchParams.get('all') === 'true';

    const where = {};

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { shortName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    const ministries = await Ministry.findAll({
      where,
      order: [['name', 'ASC']],
    });

    return NextResponse.json({ ministries });
  } catch (error) {
    console.error('Error fetching ministries:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des ministeres' },
      { status: 500 }
    );
  }
}

// POST - Creer un ministere
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
    const existing = await Ministry.findOne({ where: { code: data.code } });
    if (existing) {
      return NextResponse.json(
        { error: 'Un ministere avec ce code existe deja' },
        { status: 400 }
      );
    }

    const ministry = await Ministry.create(data);

    return NextResponse.json({ ministry }, { status: 201 });
  } catch (error) {
    console.error('Error creating ministry:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du ministere' },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour un ministere
export async function PUT(request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: 'ID du ministere requis' },
        { status: 400 }
      );
    }

    const ministry = await Ministry.findByPk(data.id);
    if (!ministry) {
      return NextResponse.json(
        { error: 'Ministere non trouve' },
        { status: 404 }
      );
    }

    // Verifier l'unicite du code si modifie
    if (data.code && data.code !== ministry.code) {
      const existing = await Ministry.findOne({ where: { code: data.code } });
      if (existing) {
        return NextResponse.json(
          { error: 'Un ministere avec ce code existe deja' },
          { status: 400 }
        );
      }
    }

    await ministry.update(data);

    return NextResponse.json({ ministry });
  } catch (error) {
    console.error('Error updating ministry:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour du ministere' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un ministere
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID du ministere requis' },
        { status: 400 }
      );
    }

    const ministry = await Ministry.findByPk(id);
    if (!ministry) {
      return NextResponse.json(
        { error: 'Ministere non trouve' },
        { status: 404 }
      );
    }

    await ministry.destroy();

    return NextResponse.json({ message: 'Ministere supprime avec succes' });
  } catch (error) {
    console.error('Error deleting ministry:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du ministere' },
      { status: 500 }
    );
  }
}
