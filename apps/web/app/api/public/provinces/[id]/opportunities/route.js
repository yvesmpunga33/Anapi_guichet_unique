import { NextResponse } from 'next/server';
import { ProvinceOpportunity, Province, Sector, OpportunityDocument } from '../../../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Opportunites publiques d'une province
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const sectorId = searchParams.get('sectorId');
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Get province info
    const province = await Province.findByPk(id);
    if (!province) {
      return NextResponse.json(
        { error: 'Province non trouvee' },
        { status: 404 }
      );
    }

    // Build where clause - only PUBLISHED opportunities
    const where = {
      provinceId: id,
      status: 'PUBLISHED',
    };

    if (sectorId) {
      where.sectorId = sectorId;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows: opportunities } = await ProvinceOpportunity.findAndCountAll({
      where,
      include: [
        {
          model: Province,
          as: 'province',
          attributes: ['id', 'code', 'name', 'capital'],
        },
        {
          model: Sector,
          as: 'sector',
          attributes: ['id', 'code', 'name', 'color'],
        },
      ],
      order: [
        ['isFeatured', 'DESC'],
        ['createdAt', 'DESC'],
      ],
      limit,
      offset,
    });

    return NextResponse.json({
      province: {
        id: province.id,
        code: province.code,
        name: province.name,
        capital: province.capital,
      },
      opportunities,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching province opportunities:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des opportunites', details: error.message },
      { status: 500 }
    );
  }
}
