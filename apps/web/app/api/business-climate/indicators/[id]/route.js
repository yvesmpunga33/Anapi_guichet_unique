import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import {
  ClimateIndicator,
  ClimateIndicatorValue,
} from '../../../../../models/index.js';

// GET /api/business-climate/indicators/[id] - Get a single indicator with all values
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const indicator = await ClimateIndicator.findByPk(id, {
      include: [
        {
          model: ClimateIndicatorValue,
          as: 'values',
          separate: true,
          order: [['year', 'DESC'], ['quarter', 'DESC'], ['month', 'DESC']],
        },
      ],
    });

    if (!indicator) {
      return NextResponse.json({ error: 'Indicateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json(indicator);
  } catch (error) {
    console.error('Error fetching indicator:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'indicateur', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/business-climate/indicators/[id] - Update an indicator
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const indicator = await ClimateIndicator.findByPk(id);
    if (!indicator) {
      return NextResponse.json({ error: 'Indicateur non trouvé' }, { status: 404 });
    }

    const {
      name,
      description,
      category,
      subCategory,
      measureType,
      unit,
      betterDirection,
      dataSource,
      updateFrequency,
      targetValue,
      targetYear,
      isActive,
      displayOrder,
      metadata,
    } = body;

    await indicator.update({
      name: name !== undefined ? name : indicator.name,
      description: description !== undefined ? description : indicator.description,
      category: category || indicator.category,
      subCategory: subCategory !== undefined ? subCategory : indicator.subCategory,
      measureType: measureType || indicator.measureType,
      unit: unit !== undefined ? unit : indicator.unit,
      betterDirection: betterDirection || indicator.betterDirection,
      dataSource: dataSource !== undefined ? dataSource : indicator.dataSource,
      updateFrequency: updateFrequency || indicator.updateFrequency,
      targetValue: targetValue !== undefined ? targetValue : indicator.targetValue,
      targetYear: targetYear !== undefined ? targetYear : indicator.targetYear,
      isActive: isActive !== undefined ? isActive : indicator.isActive,
      displayOrder: displayOrder !== undefined ? displayOrder : indicator.displayOrder,
      metadata: metadata !== undefined ? metadata : indicator.metadata,
    });

    return NextResponse.json(indicator);
  } catch (error) {
    console.error('Error updating indicator:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'indicateur', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/business-climate/indicators/[id] - Delete an indicator
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const indicator = await ClimateIndicator.findByPk(id);
    if (!indicator) {
      return NextResponse.json({ error: 'Indicateur non trouvé' }, { status: 404 });
    }

    // Check if there are associated values
    const valueCount = await ClimateIndicatorValue.count({ where: { indicatorId: id } });
    if (valueCount > 0) {
      return NextResponse.json(
        { error: `Impossible de supprimer: ${valueCount} valeur(s) associée(s). Supprimez d'abord les valeurs ou désactivez l'indicateur.` },
        { status: 400 }
      );
    }

    await indicator.destroy();

    return NextResponse.json({ message: 'Indicateur supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting indicator:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'indicateur', details: error.message },
      { status: 500 }
    );
  }
}
