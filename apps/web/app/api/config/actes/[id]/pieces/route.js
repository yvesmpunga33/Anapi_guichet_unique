import { NextResponse } from 'next/server';
import { PieceRequise, ActeAdministratif } from '../../../../../../models/index.js';

// GET - Liste des pieces requises d'un acte
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Verifier que l'acte existe
    const acte = await ActeAdministratif.findByPk(id);
    if (!acte) {
      return NextResponse.json(
        { error: 'Acte non trouve' },
        { status: 404 }
      );
    }

    const pieces = await PieceRequise.findAll({
      where: { acteId: id },
      order: [['orderIndex', 'ASC']],
    });

    return NextResponse.json({ pieces, acte: { id: acte.id, code: acte.code, name: acte.name } });
  } catch (error) {
    console.error('Error fetching pieces:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des pieces' },
      { status: 500 }
    );
  }
}

// POST - Ajouter une piece requise
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Verifier que l'acte existe
    const acte = await ActeAdministratif.findByPk(id);
    if (!acte) {
      return NextResponse.json(
        { error: 'Acte non trouve' },
        { status: 404 }
      );
    }

    // Validation
    if (!data.name) {
      return NextResponse.json(
        { error: 'Nom de la piece requis' },
        { status: 400 }
      );
    }

    // Determiner l'ordre
    const lastPiece = await PieceRequise.findOne({
      where: { acteId: id },
      order: [['orderIndex', 'DESC']],
    });
    const orderIndex = data.orderIndex || (lastPiece ? lastPiece.orderIndex + 1 : 1);

    const piece = await PieceRequise.create({
      ...data,
      acteId: id,
      orderIndex,
    });

    return NextResponse.json({ piece }, { status: 201 });
  } catch (error) {
    console.error('Error creating piece:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de la piece' },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour une piece
export async function PUT(request, { params }) {
  try {
    const { id: acteId } = await params;
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: 'ID de la piece requis' },
        { status: 400 }
      );
    }

    const piece = await PieceRequise.findOne({
      where: { id: data.id, acteId },
    });

    if (!piece) {
      return NextResponse.json(
        { error: 'Piece non trouvee' },
        { status: 404 }
      );
    }

    await piece.update(data);

    return NextResponse.json({ piece });
  } catch (error) {
    console.error('Error updating piece:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de la piece' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une piece
export async function DELETE(request, { params }) {
  try {
    const { id: acteId } = await params;
    const { searchParams } = new URL(request.url);
    const pieceId = searchParams.get('pieceId');

    if (!pieceId) {
      return NextResponse.json(
        { error: 'ID de la piece requis' },
        { status: 400 }
      );
    }

    const piece = await PieceRequise.findOne({
      where: { id: pieceId, acteId },
    });

    if (!piece) {
      return NextResponse.json(
        { error: 'Piece non trouvee' },
        { status: 404 }
      );
    }

    const deletedOrder = piece.orderIndex;
    await piece.destroy();

    // Reordonner les pieces restantes
    await PieceRequise.decrement('orderIndex', {
      by: 1,
      where: {
        acteId,
        orderIndex: { [require('sequelize').Op.gt]: deletedOrder },
      },
    });

    return NextResponse.json({ message: 'Piece supprimee avec succes' });
  } catch (error) {
    console.error('Error deleting piece:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la piece' },
      { status: 500 }
    );
  }
}
