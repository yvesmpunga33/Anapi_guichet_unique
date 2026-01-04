import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { Bidder, Country, Province, City, Sector } from '../../../../../models/index.js';

// GET - Récupérer un soumissionnaire
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const bidder = await Bidder.findByPk(id);

    if (!bidder) {
      return NextResponse.json(
        { error: 'Soumissionnaire non trouvé' },
        { status: 404 }
      );
    }

    const bidderJson = bidder.toJSON();

    // Enrichir manuellement les relations
    if (bidderJson.countryId) {
      try {
        const country = await Country.findByPk(bidderJson.countryId, {
          attributes: ['id', 'code', 'name'],
        });
        bidderJson.country = country ? country.toJSON() : null;
      } catch (e) {
        bidderJson.country = null;
      }
    }

    if (bidderJson.provinceId) {
      try {
        const province = await Province.findByPk(bidderJson.provinceId, {
          attributes: ['id', 'code', 'name'],
        });
        bidderJson.province = province ? province.toJSON() : null;
      } catch (e) {
        bidderJson.province = null;
      }
    }

    if (bidderJson.cityId) {
      try {
        const city = await City.findByPk(bidderJson.cityId, {
          attributes: ['id', 'code', 'name'],
        });
        bidderJson.city = city ? city.toJSON() : null;
      } catch (e) {
        bidderJson.city = null;
      }
    }

    if (bidderJson.sectorId) {
      try {
        const sector = await Sector.findByPk(bidderJson.sectorId, {
          attributes: ['id', 'code', 'name'],
        });
        bidderJson.sector = sector ? sector.toJSON() : null;
      } catch (e) {
        bidderJson.sector = null;
      }
    }

    return NextResponse.json({
      success: true,
      data: bidderJson,
    });
  } catch (error) {
    console.error('Error fetching bidder:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du soumissionnaire', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un soumissionnaire
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const bidder = await Bidder.findByPk(id);

    if (!bidder) {
      return NextResponse.json(
        { error: 'Soumissionnaire non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier l'unicité du RCCM si modifié
    if (body.rccm && body.rccm !== bidder.rccm) {
      const existingRccm = await Bidder.findOne({ where: { rccm: body.rccm } });
      if (existingRccm) {
        return NextResponse.json(
          { error: 'Un soumissionnaire avec ce RCCM existe déjà' },
          { status: 400 }
        );
      }
    }

    // Vérifier l'unicité du NIF si modifié
    if (body.nif && body.nif !== bidder.nif) {
      const existingNif = await Bidder.findOne({ where: { nif: body.nif } });
      if (existingNif) {
        return NextResponse.json(
          { error: 'Un soumissionnaire avec ce NIF existe déjà' },
          { status: 400 }
        );
      }
    }

    await bidder.update(body);

    // Récupérer le bidder mis à jour
    const updatedBidder = await Bidder.findByPk(id);
    const bidderJson = updatedBidder.toJSON();

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
      message: 'Soumissionnaire mis à jour avec succès',
    });
  } catch (error) {
    console.error('Error updating bidder:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du soumissionnaire', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un soumissionnaire
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const bidder = await Bidder.findByPk(id);

    if (!bidder) {
      return NextResponse.json(
        { error: 'Soumissionnaire non trouvé' },
        { status: 404 }
      );
    }

    await bidder.destroy();

    return NextResponse.json({
      success: true,
      message: 'Soumissionnaire supprimé avec succès',
    });
  } catch (error) {
    console.error('Error deleting bidder:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du soumissionnaire', details: error.message },
      { status: 500 }
    );
  }
}
