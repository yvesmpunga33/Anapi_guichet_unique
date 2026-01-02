import { NextResponse } from 'next/server';
import { City, Province } from '../../../../../models/index.js';

// GET - Obtenir une ville par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const city = await City.findByPk(id, {
      include: [
        { model: Province, as: 'province', attributes: ['id', 'code', 'name'] },
      ],
    });

    if (!city) {
      return NextResponse.json(
        { error: 'Ville non trouvee' },
        { status: 404 }
      );
    }

    return NextResponse.json({ city });
  } catch (error) {
    console.error('Error fetching city:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de la ville' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre a jour une ville
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const city = await City.findByPk(id);

    if (!city) {
      return NextResponse.json(
        { error: 'Ville non trouvee' },
        { status: 404 }
      );
    }

    // Verifier si le nouveau code existe deja dans la meme province
    if (data.code && (data.code.toUpperCase() !== city.code || data.provinceId !== city.provinceId)) {
      const targetProvinceId = data.provinceId || city.provinceId;
      const existingCity = await City.findOne({
        where: {
          code: data.code.toUpperCase(),
          provinceId: targetProvinceId,
        },
      });

      if (existingCity && existingCity.id !== id) {
        return NextResponse.json(
          { error: 'Une ville avec ce code existe deja dans cette province' },
          { status: 400 }
        );
      }
    }

    // Verifier si la nouvelle province existe
    if (data.provinceId && data.provinceId !== city.provinceId) {
      const province = await Province.findByPk(data.provinceId);
      if (!province) {
        return NextResponse.json(
          { error: 'Province non trouvee' },
          { status: 400 }
        );
      }
    }

    // Build update data
    const updateData = {};

    if (data.code !== undefined) updateData.code = data.code.toUpperCase();
    if (data.name !== undefined) updateData.name = data.name;
    if (data.provinceId !== undefined) updateData.provinceId = data.provinceId;
    if (data.population !== undefined) updateData.population = data.population ? parseInt(data.population) : null;
    if (data.isCapital !== undefined) updateData.isCapital = data.isCapital;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    await city.update(updateData);

    // Reload with province
    await city.reload({
      include: [
        { model: Province, as: 'province', attributes: ['id', 'code', 'name'] },
      ],
    });

    return NextResponse.json({ city });
  } catch (error) {
    console.error('Error updating city:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de la ville', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une ville (soft delete)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const city = await City.findByPk(id);

    if (!city) {
      return NextResponse.json(
        { error: 'Ville non trouvee' },
        { status: 404 }
      );
    }

    // Soft delete - desactiver plutot que supprimer
    await city.update({ isActive: false });

    return NextResponse.json({
      message: 'Ville desactivee avec succes',
      city
    });
  } catch (error) {
    console.error('Error deleting city:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la ville' },
      { status: 500 }
    );
  }
}
