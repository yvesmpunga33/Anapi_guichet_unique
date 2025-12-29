import { NextResponse } from 'next/server';
import { ActeAdministratif, PieceRequise, ActeAdministration, Sector, Ministry } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des actes avec filtres et pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const ministryId = searchParams.get('ministryId') || '';
    const sectorId = searchParams.get('sectorId') || '';
    const isActive = searchParams.get('isActive');
    const all = searchParams.get('all') === 'true';

    const offset = (page - 1) * limit;

    // Construire les conditions de filtre
    const where = {};

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (ministryId) {
      where.ministryId = ministryId;
    }

    if (sectorId) {
      where.sectorId = sectorId;
    }

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    const queryOptions = {
      where,
      include: [
        { model: Sector, as: 'sector', attributes: ['id', 'code', 'name'] },
        { model: Ministry, as: 'ministry', attributes: ['id', 'code', 'name', 'shortName'] },
        { model: PieceRequise, as: 'piecesRequises', attributes: ['id', 'name', 'isRequired'], where: { isActive: true }, required: false },
      ],
      order: [['code', 'ASC']],
    };

    if (!all) {
      queryOptions.limit = limit;
      queryOptions.offset = offset;
    }

    const { count, rows: actes } = await ActeAdministratif.findAndCountAll(queryOptions);

    return NextResponse.json({
      actes,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching actes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des actes' },
      { status: 500 }
    );
  }
}

// POST - Creer un nouvel acte
export async function POST(request) {
  try {
    const data = await request.json();

    // Validation des champs requis
    if (!data.name || !data.category) {
      return NextResponse.json(
        { error: 'Nom et categorie sont requis' },
        { status: 400 }
      );
    }

    // Generer le code si non fourni
    if (!data.code) {
      const prefix = data.category.substring(0, 3).toUpperCase();
      const count = await ActeAdministratif.count({ where: { category: data.category } });
      data.code = `${prefix}-${String(count + 1).padStart(4, '0')}`;
    }

    // Verifier l'unicite du code
    const existing = await ActeAdministratif.findOne({ where: { code: data.code } });
    if (existing) {
      return NextResponse.json(
        { error: 'Un acte avec ce code existe deja' },
        { status: 400 }
      );
    }

    const acte = await ActeAdministratif.create(data);

    // Creer les pieces requises si fournies
    if (data.piecesRequises && Array.isArray(data.piecesRequises)) {
      const pieces = data.piecesRequises.map((piece, index) => ({
        ...piece,
        acteId: acte.id,
        orderIndex: piece.orderIndex || index + 1,
      }));
      await PieceRequise.bulkCreate(pieces);
    }

    // Creer les administrations impliquees si fournies
    if (data.administrations && Array.isArray(data.administrations)) {
      const admins = data.administrations.map((admin, index) => ({
        ...admin,
        acteId: acte.id,
        stepNumber: admin.stepNumber || index + 1,
      }));
      await ActeAdministration.bulkCreate(admins);
    }

    // Recharger avec les associations
    const acteComplet = await ActeAdministratif.findByPk(acte.id, {
      include: [
        { model: Sector, as: 'sector' },
        { model: Ministry, as: 'ministry' },
        { model: PieceRequise, as: 'piecesRequises', order: [['orderIndex', 'ASC']] },
        { model: ActeAdministration, as: 'administrations', include: [{ model: Ministry, as: 'ministry' }], order: [['stepNumber', 'ASC']] },
      ],
    });

    return NextResponse.json({ acte: acteComplet }, { status: 201 });
  } catch (error) {
    console.error('Error creating acte:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de l\'acte', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour un acte
export async function PUT(request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: 'ID de l\'acte requis' },
        { status: 400 }
      );
    }

    const acte = await ActeAdministratif.findByPk(data.id);
    if (!acte) {
      return NextResponse.json(
        { error: 'Acte non trouve' },
        { status: 404 }
      );
    }

    // Verifier l'unicite du code si modifie
    if (data.code && data.code !== acte.code) {
      const existing = await ActeAdministratif.findOne({ where: { code: data.code } });
      if (existing) {
        return NextResponse.json(
          { error: 'Un acte avec ce code existe deja' },
          { status: 400 }
        );
      }
    }

    await acte.update(data);

    // Mettre a jour les pieces requises si fournies
    if (data.piecesRequises && Array.isArray(data.piecesRequises)) {
      // Supprimer les anciennes pieces non incluses
      const pieceIds = data.piecesRequises.filter(p => p.id).map(p => p.id);
      await PieceRequise.destroy({
        where: {
          acteId: acte.id,
          id: { [Op.notIn]: pieceIds },
        },
      });

      // Mettre a jour ou creer les pieces
      for (let i = 0; i < data.piecesRequises.length; i++) {
        const piece = data.piecesRequises[i];
        if (piece.id) {
          await PieceRequise.update(
            { ...piece, orderIndex: i + 1 },
            { where: { id: piece.id } }
          );
        } else {
          await PieceRequise.create({
            ...piece,
            acteId: acte.id,
            orderIndex: i + 1,
          });
        }
      }
    }

    // Recharger avec les associations
    const acteComplet = await ActeAdministratif.findByPk(acte.id, {
      include: [
        { model: Sector, as: 'sector' },
        { model: Ministry, as: 'ministry' },
        { model: PieceRequise, as: 'piecesRequises', order: [['orderIndex', 'ASC']] },
        { model: ActeAdministration, as: 'administrations', include: [{ model: Ministry, as: 'ministry' }], order: [['stepNumber', 'ASC']] },
      ],
    });

    return NextResponse.json({ acte: acteComplet });
  } catch (error) {
    console.error('Error updating acte:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de l\'acte' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un acte
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'acte requis' },
        { status: 400 }
      );
    }

    const acte = await ActeAdministratif.findByPk(id);
    if (!acte) {
      return NextResponse.json(
        { error: 'Acte non trouve' },
        { status: 404 }
      );
    }

    // Supprimer les pieces et administrations (cascade)
    await PieceRequise.destroy({ where: { acteId: id } });
    await ActeAdministration.destroy({ where: { acteId: id } });
    await acte.destroy();

    return NextResponse.json({ message: 'Acte supprime avec succes' });
  } catch (error) {
    console.error('Error deleting acte:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'acte' },
      { status: 500 }
    );
  }
}
