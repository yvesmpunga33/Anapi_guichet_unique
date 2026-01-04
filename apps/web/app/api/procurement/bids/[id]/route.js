import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { Bid, Bidder, Tender, TenderLot } from '../../../../../models/index.js';

// GET - Détails d'une soumission
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const bid = await Bid.findByPk(id);

    if (!bid) {
      return NextResponse.json({ error: 'Soumission non trouvee' }, { status: 404 });
    }

    const bidJson = bid.toJSON();

    // Enrichir avec le soumissionnaire
    if (bidJson.bidderId) {
      try {
        const bidder = await Bidder.findByPk(bidJson.bidderId);
        bidJson.bidder = bidder ? bidder.toJSON() : null;
      } catch (e) {
        bidJson.bidder = null;
      }
    }

    // Enrichir avec l'appel d'offres
    if (bidJson.tenderId) {
      try {
        const tender = await Tender.findByPk(bidJson.tenderId);
        bidJson.tender = tender ? tender.toJSON() : null;
      } catch (e) {
        bidJson.tender = null;
      }
    }

    // Enrichir avec le lot
    if (bidJson.lotId) {
      try {
        const lot = await TenderLot.findByPk(bidJson.lotId);
        bidJson.lot = lot ? lot.toJSON() : null;
      } catch (e) {
        bidJson.lot = null;
      }
    }

    return NextResponse.json({
      success: true,
      data: bidJson,
    });

  } catch (error) {
    console.error('Error fetching bid:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de la soumission', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une soumission
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const bid = await Bid.findByPk(id);

    if (!bid) {
      return NextResponse.json({ error: 'Soumission non trouvee' }, { status: 404 });
    }

    // Vérifier que l'appel d'offres existe si modifié
    if (body.tenderId && body.tenderId !== bid.tenderId) {
      const tender = await Tender.findByPk(body.tenderId);
      if (!tender) {
        return NextResponse.json(
          { error: 'Appel d\'offres non trouve' },
          { status: 404 }
        );
      }
    }

    // Vérifier que le soumissionnaire existe si modifié
    if (body.bidderId && body.bidderId !== bid.bidderId) {
      const bidder = await Bidder.findByPk(body.bidderId);
      if (!bidder) {
        return NextResponse.json(
          { error: 'Soumissionnaire non trouve' },
          { status: 404 }
        );
      }
    }

    await bid.update(body);

    // Récupérer la soumission mise à jour avec les relations
    const updatedBid = await Bid.findByPk(id);
    const bidJson = updatedBid.toJSON();

    // Enrichir les données
    if (bidJson.bidderId) {
      const bidder = await Bidder.findByPk(bidJson.bidderId);
      bidJson.bidder = bidder ? bidder.toJSON() : null;
    }

    if (bidJson.tenderId) {
      const tender = await Tender.findByPk(bidJson.tenderId);
      bidJson.tender = tender ? tender.toJSON() : null;
    }

    if (bidJson.lotId) {
      const lot = await TenderLot.findByPk(bidJson.lotId);
      bidJson.lot = lot ? lot.toJSON() : null;
    }

    return NextResponse.json({
      success: true,
      data: bidJson,
      message: 'Soumission mise a jour avec succes',
    });

  } catch (error) {
    console.error('Error updating bid:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de la soumission', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une soumission
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const bid = await Bid.findByPk(id);

    if (!bid) {
      return NextResponse.json({ error: 'Soumission non trouvee' }, { status: 404 });
    }

    // Vérifier si la soumission peut être supprimée (pas en cours d'évaluation ou attribuée)
    const protectedStatuses = ['EVALUATED', 'SELECTED', 'AWARDED'];
    if (protectedStatuses.includes(bid.status)) {
      return NextResponse.json(
        { error: 'Cette soumission ne peut pas etre supprimee car elle est en cours d\'evaluation ou a ete attribuee' },
        { status: 400 }
      );
    }

    await bid.destroy();

    return NextResponse.json({
      success: true,
      message: 'Soumission supprimee avec succes',
    });

  } catch (error) {
    console.error('Error deleting bid:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la soumission', details: error.message },
      { status: 500 }
    );
  }
}
