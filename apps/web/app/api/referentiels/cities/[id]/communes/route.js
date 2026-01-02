import { NextResponse } from 'next/server';
import { Commune, City, Province } from '../../../../../../models/index.js';

// GET - Liste des communes d'une ville
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Verifier que la ville existe
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

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    const where = { cityId: id };
    if (activeOnly) {
      where.isActive = true;
    }

    const communes = await Commune.findAll({
      where,
      attributes: ['id', 'code', 'name', 'population', 'isActive'],
      order: [['name', 'ASC']],
    });

    return NextResponse.json({
      city: {
        id: city.id,
        code: city.code,
        name: city.name,
        province: city.province,
      },
      communes,
    });
  } catch (error) {
    console.error('Error fetching communes for city:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des communes' },
      { status: 500 }
    );
  }
}
