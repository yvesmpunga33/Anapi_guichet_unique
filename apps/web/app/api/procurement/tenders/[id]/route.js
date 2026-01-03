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
  User,
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

    const tender = await Tender.findByPk(id, {
      include: [
        {
          model: Ministry,
          as: 'ministry',
          attributes: ['id', 'code', 'name', 'shortName'],
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'name', 'email', 'image'],
        },
        {
          model: User,
          as: 'approvedBy',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: TenderLot,
          as: 'lots',
          include: [
            {
              model: Bidder,
              as: 'awardedBidder',
              attributes: ['id', 'code', 'companyName'],
            },
          ],
        },
        {
          model: TenderDocument,
          as: 'documents',
          attributes: ['id', 'title', 'filename', 'filepath', 'filetype', 'filesize', 'isPublic', 'createdAt'],
        },
        {
          model: TenderHistory,
          as: 'history',
          include: [
            { model: User, as: 'performedBy', attributes: ['id', 'name'] },
          ],
          order: [['createdAt', 'DESC']],
          limit: 20,
        },
        {
          model: EvaluationCommittee,
          as: 'committee',
          include: [
            { model: User, as: 'member', attributes: ['id', 'name', 'email', 'image'] },
          ],
        },
        {
          model: Bid,
          as: 'bids',
          include: [
            { model: Bidder, as: 'bidder', attributes: ['id', 'code', 'companyName'] },
          ],
        },
        {
          model: ProcurementContract,
          as: 'contracts',
          include: [
            { model: Bidder, as: 'contractor', attributes: ['id', 'code', 'companyName'] },
          ],
        },
      ],
    });

    if (!tender) {
      return NextResponse.json({ error: 'Appel d\'offres non trouve' }, { status: 404 });
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
        ...tender.toJSON(),
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
        performedById: session.user.id,
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
        performedById: session.user.id,
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

    const result = await Tender.findByPk(id, {
      include: [
        { model: TenderLot, as: 'lots' },
        { model: Ministry, as: 'ministry' },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] },
      ],
    });

    return NextResponse.json({
      success: true,
      data: result,
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
