import { NextResponse } from 'next/server';
import { Investor, Province, City } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Rechercher des investisseurs existants
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit')) || 10;

    if (!query || query.length < 2) {
      return NextResponse.json({ investors: [] });
    }

    const investors = await Investor.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { rccm: { [Op.iLike]: `%${query}%` } },
          { idNat: { [Op.iLike]: `%${query}%` } },
          { nif: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
          { phone: { [Op.iLike]: `%${query}%` } },
        ],
      },
      include: [
        { model: Province, as: 'province', attributes: ['id', 'name'] },
        { model: City, as: 'city', attributes: ['id', 'name'] },
      ],
      limit,
      order: [['name', 'ASC']],
    });

    return NextResponse.json({
      investors: investors.map(inv => ({
        id: inv.id,
        name: inv.name,
        type: inv.type,
        rccm: inv.rccm,
        idNat: inv.idNat,
        nif: inv.nif,
        email: inv.email,
        phone: inv.phone,
        country: inv.country,
        province: inv.province?.name || inv.provinceName,
        provinceId: inv.provinceId,
        city: inv.city?.name || inv.cityName,
        cityId: inv.cityId,
        commune: inv.communeName,
        communeId: inv.communeId,
        address: inv.address,
        representativeName: inv.representativeName,
        representativeFunction: inv.representativeFunction,
        representativePhone: inv.representativePhone,
        representativeEmail: inv.representativeEmail,
      })),
    });
  } catch (error) {
    console.error('Error searching investors:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche des investisseurs' },
      { status: 500 }
    );
  }
}
