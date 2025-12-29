import { NextResponse } from 'next/server';
import { PieceRequise } from '../../../../../../../models/index.js';

// POST - Reordonner les pieces
export async function POST(request, { params }) {
  try {
    const { id: acteId } = await params;
    const { pieces } = await request.json();

    if (!pieces || !Array.isArray(pieces)) {
      return NextResponse.json(
        { error: 'Liste des pieces requise' },
        { status: 400 }
      );
    }

    // Mettre a jour l'ordre de chaque piece
    for (let i = 0; i < pieces.length; i++) {
      await PieceRequise.update(
        { orderIndex: i + 1 },
        { where: { id: pieces[i].id, acteId } }
      );
    }

    return NextResponse.json({ message: 'Ordre mis a jour avec succes' });
  } catch (error) {
    console.error('Error reordering pieces:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la reordonnation des pieces' },
      { status: 500 }
    );
  }
}
