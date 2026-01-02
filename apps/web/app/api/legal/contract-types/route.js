import { NextResponse } from 'next/server';
import { ContractType } from '../../../../models/index.js';

// GET - Liste des types de contrats
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const where = {};
    if (activeOnly) where.isActive = true;

    const types = await ContractType.findAll({
      where,
      order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    });

    return NextResponse.json({ types });
  } catch (error) {
    console.error('Error fetching contract types:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des types de contrats' },
      { status: 500 }
    );
  }
}

// POST - Créer un type de contrat
export async function POST(request) {
  try {
    const data = await request.json();

    const existing = await ContractType.findOne({ where: { code: data.code } });
    if (existing) {
      return NextResponse.json(
        { error: 'Ce code existe deja' },
        { status: 400 }
      );
    }

    const type = await ContractType.create(data);
    return NextResponse.json({ type }, { status: 201 });
  } catch (error) {
    console.error('Error creating contract type:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du type de contrat' },
      { status: 500 }
    );
  }
}
