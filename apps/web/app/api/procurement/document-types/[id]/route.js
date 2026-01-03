import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { ProcurementDocumentType } from '../../../../../models/index.js';

// GET - Détail d'un type de document
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const documentType = await ProcurementDocumentType.findByPk(id);

    if (!documentType) {
      return NextResponse.json({ error: 'Type de document non trouve' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: documentType,
    });
  } catch (error) {
    console.error('Error fetching document type:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du type de document', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Modifier un type de document
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const documentType = await ProcurementDocumentType.findByPk(id);
    if (!documentType) {
      return NextResponse.json({ error: 'Type de document non trouve' }, { status: 404 });
    }

    // Vérifier l'unicité du code si modifié
    if (body.code && body.code.toUpperCase() !== documentType.code) {
      const existing = await ProcurementDocumentType.findOne({
        where: { code: body.code.toUpperCase() },
      });
      if (existing) {
        return NextResponse.json(
          { error: 'Un type de document avec ce code existe deja' },
          { status: 400 }
        );
      }
      body.code = body.code.toUpperCase();
    }

    await documentType.update(body);

    return NextResponse.json({
      success: true,
      data: documentType,
      message: 'Type de document modifie avec succes',
    });
  } catch (error) {
    console.error('Error updating document type:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification du type de document', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un type de document
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;

    const documentType = await ProcurementDocumentType.findByPk(id);
    if (!documentType) {
      return NextResponse.json({ error: 'Type de document non trouve' }, { status: 404 });
    }

    await documentType.destroy();

    return NextResponse.json({
      success: true,
      message: 'Type de document supprime avec succes',
    });
  } catch (error) {
    console.error('Error deleting document type:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du type de document', details: error.message },
      { status: 500 }
    );
  }
}
