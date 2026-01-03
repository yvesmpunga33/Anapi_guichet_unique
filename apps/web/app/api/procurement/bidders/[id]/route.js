import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { Bidder, BidderDocument, Bid, ProcurementContract, Country, Province, City, User, sequelize } from '../../../../../models/index.js';

// GET - Detail d'un soumissionnaire
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const bidder = await Bidder.findByPk(id, {
      include: [
        { model: Country, as: 'country' },
        { model: Province, as: 'province' },
        { model: City, as: 'city' },
        { model: BidderDocument, as: 'documents' },
        {
          model: Bid,
          as: 'bids',
          attributes: ['id', 'reference', 'tenderId', 'status', 'financialOffer', 'totalScore', 'ranking', 'createdAt'],
          limit: 10,
          order: [['createdAt', 'DESC']],
        },
        {
          model: ProcurementContract,
          as: 'contracts',
          attributes: ['id', 'contractNumber', 'title', 'contractValue', 'status', 'progressPercent', 'createdAt'],
          limit: 10,
          order: [['createdAt', 'DESC']],
        },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'verifiedBy', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!bidder) {
      return NextResponse.json({ error: 'Soumissionnaire non trouve' }, { status: 404 });
    }

    // Statistiques
    const [stats] = await sequelize.query(`
      SELECT
        (SELECT COUNT(*) FROM procurement_bids WHERE bidder_id = :id) as total_bids,
        (SELECT COUNT(*) FROM procurement_bids WHERE bidder_id = :id AND status = 'AWARDED') as bids_won,
        (SELECT COUNT(*) FROM procurement_contracts WHERE bidder_id = :id) as total_contracts,
        (SELECT COALESCE(SUM(contract_value), 0) FROM procurement_contracts WHERE bidder_id = :id) as contracts_value,
        (SELECT AVG(total_score) FROM procurement_bids WHERE bidder_id = :id AND total_score IS NOT NULL) as avg_score
    `, { replacements: { id } });

    return NextResponse.json({
      success: true,
      data: {
        ...bidder.toJSON(),
        stats: stats[0] || {},
      },
    });

  } catch (error) {
    console.error('Error fetching bidder:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du soumissionnaire', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Modifier un soumissionnaire
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const bidder = await Bidder.findByPk(id);
    if (!bidder) {
      return NextResponse.json({ error: 'Soumissionnaire non trouve' }, { status: 404 });
    }

    // Verifier l'unicite si modification du RCCM ou NIF
    if (body.rccm && body.rccm !== bidder.rccm) {
      const existingRccm = await Bidder.findOne({ where: { rccm: body.rccm } });
      if (existingRccm) {
        return NextResponse.json(
          { error: 'Un soumissionnaire avec ce RCCM existe deja' },
          { status: 400 }
        );
      }
    }

    if (body.nif && body.nif !== bidder.nif) {
      const existingNif = await Bidder.findOne({ where: { nif: body.nif } });
      if (existingNif) {
        return NextResponse.json(
          { error: 'Un soumissionnaire avec ce NIF existe deja' },
          { status: 400 }
        );
      }
    }

    // Gestion du blacklist
    if (body.status === 'BLACKLISTED' && bidder.status !== 'BLACKLISTED') {
      body.blacklistedById = session.user.id;
      body.blacklistStartDate = new Date();
    }

    await bidder.update(body);

    const result = await Bidder.findByPk(id, {
      include: [
        { model: Country, as: 'country' },
        { model: Province, as: 'province' },
        { model: City, as: 'city' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Soumissionnaire modifie avec succes',
    });

  } catch (error) {
    console.error('Error updating bidder:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification du soumissionnaire', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un soumissionnaire
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const bidder = await Bidder.findByPk(id);
    if (!bidder) {
      return NextResponse.json({ error: 'Soumissionnaire non trouve' }, { status: 404 });
    }

    // Verifier s'il a des soumissions ou contrats
    const [hasData] = await sequelize.query(`
      SELECT
        (SELECT COUNT(*) FROM procurement_bids WHERE bidder_id = :id) as bids,
        (SELECT COUNT(*) FROM procurement_contracts WHERE bidder_id = :id) as contracts
    `, { replacements: { id } });

    if (parseInt(hasData[0]?.bids) > 0 || parseInt(hasData[0]?.contracts) > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un soumissionnaire ayant des soumissions ou contrats. Desactivez-le a la place.' },
        { status: 400 }
      );
    }

    await bidder.destroy();

    return NextResponse.json({
      success: true,
      message: 'Soumissionnaire supprime avec succes',
    });

  } catch (error) {
    console.error('Error deleting bidder:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du soumissionnaire', details: error.message },
      { status: 500 }
    );
  }
}
