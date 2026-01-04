import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Bid, Bidder, Tender, TenderLot, sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des soumissions
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
    const tenderId = searchParams.get('tenderId') || '';
    const bidderId = searchParams.get('bidderId') || '';
    const offset = (page - 1) * limit;

    const where = {};

    // Recherche
    if (search) {
      where[Op.or] = [
        { reference: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (tenderId) where.tenderId = tenderId;
    if (bidderId) where.bidderId = bidderId;

    // Compter d'abord
    const count = await Bid.count({ where });

    // Recuperer les soumissions sans includes
    const bids = await Bid.findAll({
      where,
      order: [['submissionDate', 'DESC']],
      limit,
      offset,
    });

    // Enrichir manuellement les donnees
    const rows = await Promise.all(bids.map(async (bid) => {
      const bidJson = bid.toJSON();

      // Recuperer le soumissionnaire
      if (bidJson.bidderId) {
        try {
          const bidder = await Bidder.findByPk(bidJson.bidderId, {
            attributes: ['id', 'code', 'companyName', 'rccm', 'nif'],
          });
          bidJson.bidder = bidder ? bidder.toJSON() : null;
        } catch (e) {
          bidJson.bidder = null;
        }
      } else {
        bidJson.bidder = null;
      }

      // Recuperer l'appel d'offres
      if (bidJson.tenderId) {
        try {
          const tender = await Tender.findByPk(bidJson.tenderId, {
            attributes: ['id', 'reference', 'title', 'status', 'category'],
          });
          bidJson.tender = tender ? tender.toJSON() : null;
        } catch (e) {
          bidJson.tender = null;
        }
      } else {
        bidJson.tender = null;
      }

      // Recuperer le lot
      if (bidJson.lotId) {
        try {
          const lot = await TenderLot.findByPk(bidJson.lotId, {
            attributes: ['id', 'lotNumber', 'title'],
          });
          bidJson.lot = lot ? lot.toJSON() : null;
        } catch (e) {
          bidJson.lot = null;
        }
      } else {
        bidJson.lot = null;
      }

      return bidJson;
    }));

    // Stats par statut
    const [statusStats] = await sequelize.query(`
      SELECT status, COUNT(*) as count
      FROM procurement_bids
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
    console.error('Error fetching bids:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des soumissions', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Creer une soumission
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.tenderId) {
      return NextResponse.json(
        { error: 'L\'appel d\'offres est requis' },
        { status: 400 }
      );
    }

    if (!body.bidderId) {
      return NextResponse.json(
        { error: 'Le soumissionnaire est requis' },
        { status: 400 }
      );
    }

    // Verifier que l'appel d'offres existe
    const tender = await Tender.findByPk(body.tenderId);
    if (!tender) {
      return NextResponse.json(
        { error: 'Appel d\'offres non trouve' },
        { status: 404 }
      );
    }

    // Verifier que le soumissionnaire existe
    const bidder = await Bidder.findByPk(body.bidderId);
    if (!bidder) {
      return NextResponse.json(
        { error: 'Soumissionnaire non trouve' },
        { status: 404 }
      );
    }

    // Generer la reference automatiquement
    const currentYear = new Date().getFullYear();
    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) as count FROM procurement_bids WHERE EXTRACT(YEAR FROM created_at) = :year
    `, { replacements: { year: currentYear } });
    const count = parseInt(countResult[0]?.count || 0) + 1;
    const reference = body.reference || `SOUM-${currentYear}-${String(count).padStart(5, '0')}`;

    // Verifier si l'ID utilisateur est un UUID valide
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.user.id);

    const bid = await Bid.create({
      ...body,
      reference,
      submissionDate: body.submissionDate || new Date(),
      status: body.status || 'RECEIVED',
      receivedById: isValidUUID ? session.user.id : null,
    });

    // Recuperer sans includes
    const result = await Bid.findByPk(bid.id);
    const bidJson = result.toJSON();

    // Enrichir manuellement
    bidJson.bidder = bidder.toJSON();
    bidJson.tender = tender.toJSON();

    if (bidJson.lotId) {
      const lot = await TenderLot.findByPk(bidJson.lotId);
      bidJson.lot = lot ? lot.toJSON() : null;
    }

    return NextResponse.json({
      success: true,
      data: bidJson,
      message: 'Soumission enregistree avec succes',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating bid:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement de la soumission', details: error.message },
      { status: 500 }
    );
  }
}
