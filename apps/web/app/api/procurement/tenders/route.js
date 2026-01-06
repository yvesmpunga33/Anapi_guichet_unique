import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Tender, TenderLot, TenderHistory, Ministry, sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des appels d'offres
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
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    const year = searchParams.get('year') || '';
    const offset = (page - 1) * limit;

    const where = {};

    // Recherche
    if (search) {
      where[Op.or] = [
        { reference: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Filtres
    if (status) where.status = status;
    if (type) where.type = type;
    if (category) where.category = category;
    if (year) where.fiscalYear = parseInt(year);

    // Compter d'abord sans les includes pour éviter les problèmes de type
    const count = await Tender.count({ where });

    // Récupérer les données sans includes pour éviter problème uuid = text
    const tenders = await Tender.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // Enrichir les données manuellement
    const rows = await Promise.all(tenders.map(async (tender) => {
      const tenderJson = tender.toJSON();

      // Récupérer le ministère
      if (tenderJson.ministryId) {
        try {
          const ministry = await Ministry.findByPk(tenderJson.ministryId, {
            attributes: ['id', 'code', 'name', 'shortName'],
          });
          tenderJson.ministry = ministry ? ministry.toJSON() : null;
        } catch (e) {
          tenderJson.ministry = null;
        }
      } else {
        tenderJson.ministry = null;
      }

      // Récupérer les lots
      try {
        const lots = await TenderLot.findAll({
          where: { tenderId: tender.id },
          attributes: ['id', 'lotNumber', 'title', 'estimatedValue', 'status'],
        });
        tenderJson.lots = lots.map(l => l.toJSON());
      } catch (e) {
        tenderJson.lots = [];
      }

      return tenderJson;
    }));

    // Statistiques par statut
    const [statusStats] = await sequelize.query(`
      SELECT status, COUNT(*) as count
      FROM procurement_tenders
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
    console.error('Error fetching tenders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des appels d\'offres', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Creer un appel d'offres
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();

    // Generer la reference automatiquement
    const currentYear = new Date().getFullYear();
    const [countResult] = await sequelize.query(`
      SELECT COUNT(*) as count FROM procurement_tenders WHERE fiscal_year = :year
    `, { replacements: { year: currentYear } });

    const count = parseInt(countResult[0]?.count || 0) + 1;
    const reference = body.reference || `AO-${currentYear}-${String(count).padStart(4, '0')}`;

    // Verifier si l'ID utilisateur est un UUID valide (les champs createdById sont de type UUID)
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.user.id);

    // Mapper les champs du formulaire vers le modele
    const tenderData = {
      reference,
      title: body.title,
      description: body.description || body.objective || null,
      objective: body.objective || null,
      type: body.type || 'OPEN',
      category: body.category || 'SERVICES',
      status: body.status || 'DRAFT',
      estimatedBudget: body.estimatedBudget || null,
      currency: body.currency || 'USD',
      publishDate: body.publicationDate || body.publishDate || null,
      submissionDeadline: body.submissionDeadline || null,
      openingDate: body.openingDate || null,
      evaluationStartDate: body.evaluationStartDate || null,
      evaluationEndDate: body.evaluationEndDate || null,
      technicalCriteriaWeight: body.technicalWeight || body.technicalCriteriaWeight || 70,
      financialCriteriaWeight: body.financialWeight || body.financialCriteriaWeight || 30,
      minimumTechnicalScore: body.minimumTechnicalScore || 60,
      eligibilityCriteria: body.terms || body.eligibilityCriteria || null,
      fundingSource: body.financingSource || body.fundingSource || null,
      ministryId: body.ministryId || null,
      departmentId: body.departmentId || null,
      fiscalYear: body.fiscalYear || currentYear,
      // Ne stocker createdById que si c'est un UUID valide
      createdById: isValidUUID ? session.user.id : null,
    };

    // Creer l'appel d'offres
    const tender = await Tender.create(tenderData);

    // Creer les lots si fournis
    if (body.lots && Array.isArray(body.lots) && body.lots.length > 0) {
      for (let i = 0; i < body.lots.length; i++) {
        const lot = body.lots[i];
        // Ne creer le lot que s'il a un titre
        if (lot.title) {
          await TenderLot.create({
            tenderId: tender.id,
            lotNumber: parseInt(lot.lotNumber) || (i + 1),
            title: lot.title,
            description: lot.description || null,
            quantity: lot.quantity || null,
            unit: lot.unit || null,
            estimatedValue: lot.estimatedAmount || lot.estimatedValue || null,
            status: 'OPEN',
          });
        }
      }
    }

    // Enregistrer l'historique (performedById peut aussi ne pas etre un UUID)
    await TenderHistory.create({
      tenderId: tender.id,
      action: 'CREATED',
      newStatus: tender.status,
      description: 'Appel d\'offres cree',
      performedById: isValidUUID ? session.user.id : null,
    });

    // Recuperer l'appel d'offres sans includes pour eviter les erreurs uuid/text
    const createdTender = await Tender.findByPk(tender.id);
    const tenderJson = createdTender.toJSON();

    // Enrichir manuellement
    if (tenderJson.ministryId) {
      const ministry = await Ministry.findByPk(tenderJson.ministryId, {
        attributes: ['id', 'code', 'name', 'shortName'],
      });
      tenderJson.ministry = ministry ? ministry.toJSON() : null;
    }

    // Recuperer les lots
    const lots = await TenderLot.findAll({
      where: { tenderId: tender.id },
    });
    tenderJson.lots = lots.map(l => l.toJSON());

    return NextResponse.json({
      success: true,
      data: tenderJson,
      message: 'Appel d\'offres cree avec succes',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating tender:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de l\'appel d\'offres', details: error.message },
      { status: 500 }
    );
  }
}
