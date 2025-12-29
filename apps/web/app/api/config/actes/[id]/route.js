import { NextResponse } from 'next/server';
import { ActeAdministratif, PieceRequise, ActeAdministration, Sector, Ministry } from '../../../../../models/index.js';

// GET - Obtenir un acte par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const acte = await ActeAdministratif.findByPk(id, {
      include: [
        { model: Sector, as: 'sector' },
        { model: Ministry, as: 'ministry' },
        {
          model: PieceRequise,
          as: 'piecesRequises',
          separate: true,
          order: [['orderIndex', 'ASC']],
        },
      ],
    });

    if (!acte) {
      return NextResponse.json(
        { error: 'Acte non trouve' },
        { status: 404 }
      );
    }

    return NextResponse.json({ acte });
  } catch (error) {
    console.error('Error fetching acte:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de l\'acte' },
      { status: 500 }
    );
  }
}

// PATCH - Activer/Desactiver un acte
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const acte = await ActeAdministratif.findByPk(id);
    if (!acte) {
      return NextResponse.json(
        { error: 'Acte non trouve' },
        { status: 404 }
      );
    }

    // Toggle isActive ou mise a jour partielle
    if (data.action === 'toggle') {
      await acte.update({ isActive: !acte.isActive });
    } else {
      await acte.update(data);
    }

    return NextResponse.json({ acte });
  } catch (error) {
    console.error('Error updating acte:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de l\'acte' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un acte
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const acte = await ActeAdministratif.findByPk(id);
    if (!acte) {
      return NextResponse.json(
        { error: 'Acte non trouve' },
        { status: 404 }
      );
    }

    // Supprimer les pieces (cascade)
    await PieceRequise.destroy({ where: { acteId: id } });
    await acte.destroy();

    return NextResponse.json({ message: 'Acte supprime avec succes' });
  } catch (error) {
    console.error('Error deleting acte:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'acte' },
      { status: 500 }
    );
  }
}
