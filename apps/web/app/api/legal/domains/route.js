import { NextResponse } from 'next/server';
import { LegalDomain } from '../../../../models/index.js';

// GET - Liste des domaines juridiques
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const parentId = searchParams.get('parentId');

    const where = {};
    if (activeOnly) where.isActive = true;
    if (parentId === 'null' || parentId === '') {
      where.parentId = null;
    } else if (parentId) {
      where.parentId = parentId;
    }

    const domains = await LegalDomain.findAll({
      where,
      include: [
        { model: LegalDomain, as: 'children', required: false },
      ],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    });

    return NextResponse.json({ domains });
  } catch (error) {
    console.error('Error fetching domains:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des domaines' },
      { status: 500 }
    );
  }
}

// POST - Créer un domaine
export async function POST(request) {
  try {
    const data = await request.json();

    const existing = await LegalDomain.findOne({ where: { code: data.code } });
    if (existing) {
      return NextResponse.json(
        { error: 'Ce code existe deja' },
        { status: 400 }
      );
    }

    const domain = await LegalDomain.create(data);
    return NextResponse.json({ domain }, { status: 201 });
  } catch (error) {
    console.error('Error creating domain:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du domaine' },
      { status: 500 }
    );
  }
}
