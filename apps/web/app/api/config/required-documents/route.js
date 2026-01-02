import { NextResponse } from 'next/server';
import { RequiredDocument } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des documents requis (avec filtres optionnels)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dossierType = searchParams.get('dossierType');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const where = {};

    if (dossierType) {
      where.dossierType = dossierType;
    }

    if (activeOnly) {
      where.isActive = true;
    }

    const documents = await RequiredDocument.findAll({
      where,
      order: [['dossierType', 'ASC'], ['order', 'ASC']],
    });

    // Grouper par type de dossier si pas de filtre spécifique
    if (!dossierType) {
      const grouped = {};
      documents.forEach(doc => {
        if (!grouped[doc.dossierType]) {
          grouped[doc.dossierType] = [];
        }
        grouped[doc.dossierType].push(doc);
      });
      return NextResponse.json({ documents, grouped });
    }

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching required documents:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des documents requis' },
      { status: 500 }
    );
  }
}

// POST - Créer un document requis
export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name || !data.code || !data.dossierType) {
      return NextResponse.json(
        { error: 'Nom, code et type de dossier sont requis' },
        { status: 400 }
      );
    }

    // Vérifier l'unicité du code pour ce type de dossier
    const existing = await RequiredDocument.findOne({
      where: {
        code: data.code,
        dossierType: data.dossierType,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Un document avec ce code existe deja pour ce type de dossier' },
        { status: 400 }
      );
    }

    // Déterminer l'ordre suivant
    const maxOrder = await RequiredDocument.max('order', {
      where: { dossierType: data.dossierType },
    });
    data.order = (maxOrder || 0) + 1;

    const document = await RequiredDocument.create(data);

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error('Error creating required document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du document requis' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un document requis
export async function PUT(request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: 'ID du document requis' },
        { status: 400 }
      );
    }

    const document = await RequiredDocument.findByPk(data.id);
    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouve' },
        { status: 404 }
      );
    }

    // Vérifier l'unicité du code si modifié
    if (data.code && (data.code !== document.code || data.dossierType !== document.dossierType)) {
      const existing = await RequiredDocument.findOne({
        where: {
          code: data.code,
          dossierType: data.dossierType || document.dossierType,
          id: { [Op.ne]: data.id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Un document avec ce code existe deja pour ce type de dossier' },
          { status: 400 }
        );
      }
    }

    await document.update(data);

    return NextResponse.json({ document });
  } catch (error) {
    console.error('Error updating required document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour du document requis' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un document requis
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID du document requis' },
        { status: 400 }
      );
    }

    const document = await RequiredDocument.findByPk(id);
    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouve' },
        { status: 404 }
      );
    }

    await document.destroy();

    return NextResponse.json({ message: 'Document supprime avec succes' });
  } catch (error) {
    console.error('Error deleting required document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du document requis' },
      { status: 500 }
    );
  }
}
