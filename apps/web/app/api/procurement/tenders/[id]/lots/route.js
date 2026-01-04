import { NextResponse } from 'next/server';
import { TenderLot } from '../../../../../../models/index.js';

// GET - Liste des lots d'un appel d'offres
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const lots = await TenderLot.findAll({
      where: { tenderId: id },
      order: [['lotNumber', 'ASC']],
    });

    return NextResponse.json({
      success: true,
      data: lots.map(lot => lot.toJSON()),
    });

  } catch (error) {
    console.error('Error fetching tender lots:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des lots', details: error.message },
      { status: 500 }
    );
  }
}
