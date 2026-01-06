import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import {
  Tender,
  TenderLot,
  TenderDocument,
  TenderHistory,
  EvaluationCommittee,
  Bid,
  Bidder,
  Ministry,
  ProcurementContract,
  sequelize,
} from '../../../../../models/index.js';

// GET - Detail d'un appel d'offres
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    // Recuperer l'appel d'offres sans les includes User pour eviter l'erreur uuid = text
    const tender = await Tender.findByPk(id);

    if (!tender) {
      return NextResponse.json({ error: 'Appel d\'offres non trouve' }, { status: 404 });
    }

    const tenderJson = tender.toJSON();

    // Enrichir manuellement les donnees

    // Ministere
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

    // Lots
    try {
      const lots = await TenderLot.findAll({
        where: { tenderId: id },
      });
      // Enrichir chaque lot avec le soumissionnaire gagnant si applicable
      tenderJson.lots = await Promise.all(lots.map(async (lot) => {
        const lotJson = lot.toJSON();
        if (lotJson.awardedBidderId) {
          try {
            const bidder = await Bidder.findByPk(lotJson.awardedBidderId, {
              attributes: ['id', 'code', 'companyName'],
            });
            lotJson.awardedBidder = bidder ? bidder.toJSON() : null;
          } catch (e) {
            lotJson.awardedBidder = null;
          }
        } else {
          lotJson.awardedBidder = null;
        }
        return lotJson;
      }));
    } catch (e) {
      tenderJson.lots = [];
    }

    // Documents
    try {
      const documents = await TenderDocument.findAll({
        where: { tenderId: id },
        attributes: ['id', 'title', 'filename', 'filepath', 'filetype', 'filesize', 'isPublic', 'createdAt'],
      });
      tenderJson.documents = documents.map(d => d.toJSON());
    } catch (e) {
      tenderJson.documents = [];
    }

    // Historique (sans User pour eviter l'erreur uuid = text)
    try {
      const history = await TenderHistory.findAll({
        where: { tenderId: id },
        order: [['createdAt', 'DESC']],
        limit: 20,
      });
      tenderJson.history = history.map(h => h.toJSON());
    } catch (e) {
      tenderJson.history = [];
    }

    // Comite d'evaluation (sans User pour eviter l'erreur uuid = text)
    try {
      const committee = await EvaluationCommittee.findAll({
        where: { tenderId: id },
      });
      tenderJson.committee = committee.map(c => c.toJSON());
    } catch (e) {
      tenderJson.committee = [];
    }

    // Soumissions
    try {
      const bids = await Bid.findAll({
        where: { tenderId: id },
      });
      // Enrichir chaque soumission avec le soumissionnaire
      tenderJson.bids = await Promise.all(bids.map(async (bid) => {
        const bidJson = bid.toJSON();
        if (bidJson.bidderId) {
          try {
            const bidder = await Bidder.findByPk(bidJson.bidderId, {
              attributes: ['id', 'code', 'companyName'],
            });
            bidJson.bidder = bidder ? bidder.toJSON() : null;
          } catch (e) {
            bidJson.bidder = null;
          }
        } else {
          bidJson.bidder = null;
        }
        return bidJson;
      }));
    } catch (e) {
      tenderJson.bids = [];
    }

    // Contrats
    try {
      const contracts = await ProcurementContract.findAll({
        where: { tenderId: id },
      });
      // Enrichir chaque contrat avec le contractant
      tenderJson.contracts = await Promise.all(contracts.map(async (contract) => {
        const contractJson = contract.toJSON();
        if (contractJson.contractorId) {
          try {
            const contractor = await Bidder.findByPk(contractJson.contractorId, {
              attributes: ['id', 'code', 'companyName'],
            });
            contractJson.contractor = contractor ? contractor.toJSON() : null;
          } catch (e) {
            contractJson.contractor = null;
          }
        } else {
          contractJson.contractor = null;
        }
        return contractJson;
      }));
    } catch (e) {
      tenderJson.contracts = [];
    }

    // Statistiques des soumissions
    const [bidStats] = await sequelize.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'RECEIVED') as received,
        COUNT(*) FILTER (WHERE status = 'EVALUATED') as evaluated,
        COUNT(*) FILTER (WHERE status = 'AWARDED') as awarded,
        AVG(financial_offer) as avg_offer,
        MIN(financial_offer) as min_offer,
        MAX(financial_offer) as max_offer
      FROM procurement_bids
      WHERE tender_id = :tenderId
    `, { replacements: { tenderId: id } });

    return NextResponse.json({
      success: true,
      data: {
        ...tenderJson,
        bidStats: bidStats[0] || {},
      },
    });

  } catch (error) {
    console.error('Error fetching tender:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de l\'appel d\'offres', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Modifier un appel d'offres
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const tender = await Tender.findByPk(id);
    if (!tender) {
      return NextResponse.json({ error: 'Appel d\'offres non trouve' }, { status: 404 });
    }

    const previousStatus = tender.status;

    // Verifier si l'ID utilisateur est un UUID valide
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.user.id);

    // Mettre a jour
    await tender.update(body);

    // Enregistrer l'historique si le statut a change
    if (body.status && body.status !== previousStatus) {
      await TenderHistory.create({
        tenderId: id,
        action: 'STATUS_CHANGED',
        previousStatus,
        newStatus: body.status,
        description: `Statut change de ${previousStatus} a ${body.status}`,
        performedById: isValidUUID ? session.user.id : null,
      });

      // Actions specifiques selon le nouveau statut
      if (body.status === 'PUBLISHED') {
        await tender.update({ publishDate: new Date() });
      } else if (body.status === 'AWARDED') {
        await tender.update({ awardDate: new Date() });
      }
    } else {
      await TenderHistory.create({
        tenderId: id,
        action: 'UPDATED',
        description: 'Appel d\'offres modifie',
        performedById: isValidUUID ? session.user.id : null,
      });
    }

    // Mettre a jour les lots si fournis
    if (body.lots && Array.isArray(body.lots)) {
      // Supprimer les lots existants non dans la liste
      const lotIds = body.lots.filter(l => l.id).map(l => l.id);
      await TenderLot.destroy({
        where: {
          tenderId: id,
          id: { [require('sequelize').Op.notIn]: lotIds },
        },
      });

      // Creer ou mettre a jour les lots
      for (let i = 0; i < body.lots.length; i++) {
        const lot = body.lots[i];
        if (lot.id) {
          await TenderLot.update(lot, { where: { id: lot.id } });
        } else {
          await TenderLot.create({
            ...lot,
            tenderId: id,
            lotNumber: lot.lotNumber || i + 1,
          });
        }
      }
    }

    // Recuperer l'appel d'offres sans includes User pour eviter l'erreur uuid = text
    const result = await Tender.findByPk(id);
    const resultJson = result.toJSON();

    // Enrichir manuellement
    if (resultJson.ministryId) {
      try {
        const ministry = await Ministry.findByPk(resultJson.ministryId, {
          attributes: ['id', 'code', 'name', 'shortName'],
        });
        resultJson.ministry = ministry ? ministry.toJSON() : null;
      } catch (e) {
        resultJson.ministry = null;
      }
    } else {
      resultJson.ministry = null;
    }

    // Recuperer les lots
    try {
      const lots = await TenderLot.findAll({
        where: { tenderId: id },
      });
      resultJson.lots = lots.map(l => l.toJSON());
    } catch (e) {
      resultJson.lots = [];
    }

    return NextResponse.json({
      success: true,
      data: resultJson,
      message: 'Appel d\'offres modifie avec succes',
    });

  } catch (error) {
    console.error('Error updating tender:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification de l\'appel d\'offres', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un appel d'offres
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const tender = await Tender.findByPk(id);
    if (!tender) {
      return NextResponse.json({ error: 'Appel d\'offres non trouve' }, { status: 404 });
    }

    // Verifier si on peut supprimer (seulement brouillon)
    if (tender.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Impossible de supprimer un appel d\'offres publie. Utilisez l\'annulation.' },
        { status: 400 }
      );
    }

    await tender.destroy();

    return NextResponse.json({
      success: true,
      message: 'Appel d\'offres supprime avec succes',
    });

  } catch (error) {
    console.error('Error deleting tender:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'appel d\'offres', details: error.message },
      { status: 500 }
    );
  }
}
