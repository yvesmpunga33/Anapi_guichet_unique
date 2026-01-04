import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Bidder, BidderDocument, Country, Province, City, User, sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des soumissionnaires
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const offset = (page - 1) * limit;

    const where = {};

    // Recherche
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { companyName: { [Op.iLike]: `%${search}%` } },
        { rccm: { [Op.iLike]: `%${search}%` } },
        { nif: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;

    // Compter d'abord
    const count = await Bidder.count({ where });

    // Recuperer les soumissionnaires sans includes pour eviter les problemes de type
    const bidders = await Bidder.findAll({
      where,
      order: [['companyName', 'ASC']],
      limit,
      offset,
    });

    // Enrichir manuellement les donnees
    const rows = await Promise.all(bidders.map(async (bidder) => {
      const bidderJson = bidder.toJSON();

      // Recuperer le pays
      if (bidderJson.countryId) {
        try {
          const country = await Country.findByPk(bidderJson.countryId, {
            attributes: ['id', 'code', 'name'],
          });
          bidderJson.country = country ? country.toJSON() : null;
        } catch (e) {
          bidderJson.country = null;
        }
      } else {
        bidderJson.country = null;
      }

      // Recuperer la province
      if (bidderJson.provinceId) {
        try {
          const province = await Province.findByPk(bidderJson.provinceId, {
            attributes: ['id', 'code', 'name'],
          });
          bidderJson.province = province ? province.toJSON() : null;
        } catch (e) {
          bidderJson.province = null;
        }
      } else {
        bidderJson.province = null;
      }

      // Recuperer la ville
      if (bidderJson.cityId) {
        try {
          const city = await City.findByPk(bidderJson.cityId, {
            attributes: ['id', 'code', 'name'],
          });
          bidderJson.city = city ? city.toJSON() : null;
        } catch (e) {
          bidderJson.city = null;
        }
      } else {
        bidderJson.city = null;
      }

      return bidderJson;
    }));

    // Stats par statut
    const [statusStats] = await sequelize.query(`
      SELECT status, COUNT(*) as count
      FROM procurement_bidders
      GROUP BY status
    `);

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
      stats: {
        byStatus: statusStats,
      },
    });

  } catch (error) {
    console.error('Error fetching bidders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des soumissionnaires', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Creer un soumissionnaire
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();

    // Generer le code automatiquement
    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) as count FROM procurement_bidders
    `);
    const count = parseInt(countResult[0]?.count || 0) + 1;
    const code = body.code || `ENT-${String(count).padStart(5, '0')}`;

    // Verifier l'unicite du RCCM et NIF
    if (body.rccm) {
      const existingRccm = await Bidder.findOne({ where: { rccm: body.rccm } });
      if (existingRccm) {
        return NextResponse.json(
          { error: 'Un soumissionnaire avec ce RCCM existe deja' },
          { status: 400 }
        );
      }
    }

    if (body.nif) {
      const existingNif = await Bidder.findOne({ where: { nif: body.nif } });
      if (existingNif) {
        return NextResponse.json(
          { error: 'Un soumissionnaire avec ce NIF existe deja' },
          { status: 400 }
        );
      }
    }

    // Verifier si l'ID utilisateur est un UUID valide
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.user.id);

    const bidder = await Bidder.create({
      ...body,
      code,
      createdById: isValidUUID ? session.user.id : null,
      status: body.status || 'ACTIVE',
    });

    // Recuperer sans includes pour eviter les erreurs
    const result = await Bidder.findByPk(bidder.id);
    const bidderJson = result.toJSON();

    // Enrichir manuellement
    if (bidderJson.countryId) {
      const country = await Country.findByPk(bidderJson.countryId, { attributes: ['id', 'code', 'name'] });
      bidderJson.country = country ? country.toJSON() : null;
    }
    if (bidderJson.provinceId) {
      const province = await Province.findByPk(bidderJson.provinceId, { attributes: ['id', 'code', 'name'] });
      bidderJson.province = province ? province.toJSON() : null;
    }
    if (bidderJson.cityId) {
      const city = await City.findByPk(bidderJson.cityId, { attributes: ['id', 'code', 'name'] });
      bidderJson.city = city ? city.toJSON() : null;
    }

    return NextResponse.json({
      success: true,
      data: bidderJson,
      message: 'Soumissionnaire cree avec succes',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating bidder:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du soumissionnaire', details: error.message },
      { status: 500 }
    );
  }
}
