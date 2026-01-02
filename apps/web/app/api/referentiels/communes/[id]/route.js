import { NextResponse } from 'next/server';
import { Commune, City, Province } from '../../../../../models/index.js';

// GET - Obtenir une commune par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const commune = await Commune.findByPk(id, {
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'code', 'name'],
          include: [
            { model: Province, as: 'province', attributes: ['id', 'code', 'name'] },
          ],
        },
      ],
    });

    if (!commune) {
      return NextResponse.json(
        { error: 'Commune non trouvee' },
        { status: 404 }
      );
    }

    return NextResponse.json({ commune });
  } catch (error) {
    console.error('Error fetching commune:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de la commune' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre a jour une commune
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const commune = await Commune.findByPk(id);

    if (!commune) {
      return NextResponse.json(
        { error: 'Commune non trouvee' },
        { status: 404 }
      );
    }

    // Verifier si le nouveau code existe deja dans la meme ville
    if (data.code && (data.code.toUpperCase() !== commune.code || data.cityId !== commune.cityId)) {
      const targetCityId = data.cityId || commune.cityId;
      const existingCommune = await Commune.findOne({
        where: {
          code: data.code.toUpperCase(),
          cityId: targetCityId,
        },
      });

      if (existingCommune && existingCommune.id !== id) {
        return NextResponse.json(
          { error: 'Une commune avec ce code existe deja dans cette ville' },
          { status: 400 }
        );
      }
    }

    // Verifier si la nouvelle ville existe
    if (data.cityId && data.cityId !== commune.cityId) {
      const city = await City.findByPk(data.cityId);
      if (!city) {
        return NextResponse.json(
          { error: 'Ville non trouvee' },
          { status: 400 }
        );
      }
    }

    // Build update data
    const updateData = {};

    if (data.code !== undefined) updateData.code = data.code.toUpperCase();
    if (data.name !== undefined) updateData.name = data.name;
    if (data.cityId !== undefined) updateData.cityId = data.cityId;
    if (data.population !== undefined) updateData.population = data.population ? parseInt(data.population) : null;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    await commune.update(updateData);

    // Reload with city
    await commune.reload({
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'code', 'name'],
          include: [
            { model: Province, as: 'province', attributes: ['id', 'code', 'name'] },
          ],
        },
      ],
    });

    return NextResponse.json({ commune });
  } catch (error) {
    console.error('Error updating commune:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de la commune', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une commune (soft delete)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const commune = await Commune.findByPk(id);

    if (!commune) {
      return NextResponse.json(
        { error: 'Commune non trouvee' },
        { status: 404 }
      );
    }

    // Soft delete - desactiver plutot que supprimer
    await commune.update({ isActive: false });

    return NextResponse.json({
      message: 'Commune desactivee avec succes',
      commune
    });
  } catch (error) {
    console.error('Error deleting commune:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la commune' },
      { status: 500 }
    );
  }
}
