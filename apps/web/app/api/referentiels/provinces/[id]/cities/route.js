import { NextResponse } from 'next/server';
import { City, Province } from '../../../../../../models/index.js';

// GET - Liste des villes d'une province
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Verifier que la province existe
    const province = await Province.findByPk(id);
    if (!province) {
      return NextResponse.json(
        { error: 'Province non trouvee' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    const where = { provinceId: id };
    if (activeOnly) {
      where.isActive = true;
    }

    const cities = await City.findAll({
      where,
      attributes: ['id', 'code', 'name', 'population', 'isCapital', 'isActive'],
      order: [
        ['isCapital', 'DESC'], // Capitales en premier
        ['name', 'ASC'],
      ],
    });

    return NextResponse.json({
      province: {
        id: province.id,
        code: province.code,
        name: province.name,
      },
      cities,
    });
  } catch (error) {
    console.error('Error fetching cities for province:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des villes' },
      { status: 500 }
    );
  }
}
