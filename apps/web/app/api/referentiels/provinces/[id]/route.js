import { NextResponse } from 'next/server';
import { Province } from '../../../../../models/index.js';

// GET - Obtenir une province par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const province = await Province.findByPk(id);

    if (!province) {
      return NextResponse.json(
        { error: 'Province non trouvee' },
        { status: 404 }
      );
    }

    return NextResponse.json({ province });
  } catch (error) {
    console.error('Error fetching province:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de la province' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre a jour une province
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const province = await Province.findByPk(id);

    if (!province) {
      return NextResponse.json(
        { error: 'Province non trouvee' },
        { status: 404 }
      );
    }

    // Verifier si le nouveau code existe deja (si changement de code)
    if (data.code && data.code.toUpperCase() !== province.code) {
      const existingProvince = await Province.findOne({
        where: { code: data.code.toUpperCase() },
      });

      if (existingProvince) {
        return NextResponse.json(
          { error: 'Une province avec ce code existe deja' },
          { status: 400 }
        );
      }
    }

    // Build update data
    const updateData = {};

    if (data.code !== undefined) updateData.code = data.code.toUpperCase();
    if (data.name !== undefined) updateData.name = data.name;
    if (data.capital !== undefined) updateData.capital = data.capital || null;
    if (data.population !== undefined) updateData.population = data.population ? parseInt(data.population) : null;
    if (data.area !== undefined) updateData.area = data.area ? parseFloat(data.area) : null;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    await province.update(updateData);

    return NextResponse.json({ province });
  } catch (error) {
    console.error('Error updating province:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de la province', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une province
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const province = await Province.findByPk(id);

    if (!province) {
      return NextResponse.json(
        { error: 'Province non trouvee' },
        { status: 404 }
      );
    }

    // Soft delete - desactiver plutot que supprimer
    // pour preserver l'integrite referentielle
    await province.update({ isActive: false });

    return NextResponse.json({
      message: 'Province desactivee avec succes',
      province
    });
  } catch (error) {
    console.error('Error deleting province:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la province' },
      { status: 500 }
    );
  }
}
