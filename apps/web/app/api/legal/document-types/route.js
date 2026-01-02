import { NextResponse } from 'next/server';
import { LegalDocumentType } from '../../../../models/index.js';

// GET - Liste des types de documents
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const category = searchParams.get('category');

    const where = {};
    if (activeOnly) where.isActive = true;
    if (category) where.category = category;

    const types = await LegalDocumentType.findAll({
      where,
      order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    });

    return NextResponse.json({ types });
  } catch (error) {
    console.error('Error fetching document types:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des types' },
      { status: 500 }
    );
  }
}

// POST - Créer un type de document
export async function POST(request) {
  try {
    const data = await request.json();

    // Vérifier si le code existe déjà
    const existing = await LegalDocumentType.findOne({ where: { code: data.code } });
    if (existing) {
      return NextResponse.json(
        { error: 'Ce code existe deja' },
        { status: 400 }
      );
    }

    const type = await LegalDocumentType.create(data);
    return NextResponse.json({ type }, { status: 201 });
  } catch (error) {
    console.error('Error creating document type:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du type' },
      { status: 500 }
    );
  }
}
