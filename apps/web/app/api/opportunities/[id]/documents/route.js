import { NextResponse } from 'next/server';
import { OpportunityDocument, ProvinceOpportunity } from '../../../../../models/index.js';
import { auth } from '../../../../lib/auth.js';

// GET - Liste des documents requis pour une opportunite
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const opportunity = await ProvinceOpportunity.findByPk(id);
    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunite non trouvee' },
        { status: 404 }
      );
    }

    const documents = await OpportunityDocument.findAll({
      where: { opportunityId: id },
      order: [['sortOrder', 'ASC']],
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des documents', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Ajouter un document requis
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const opportunity = await ProvinceOpportunity.findByPk(id);
    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunite non trouvee' },
        { status: 404 }
      );
    }

    // Get max sortOrder
    const maxOrder = await OpportunityDocument.max('sortOrder', {
      where: { opportunityId: id },
    }) || 0;

    const document = await OpportunityDocument.create({
      opportunityId: id,
      name: data.name,
      description: data.description || null,
      isRequired: data.isRequired !== false,
      category: data.category || 'OTHER',
      templateUrl: data.templateUrl || null,
      maxFileSize: data.maxFileSize || 10485760,
      allowedFormats: data.allowedFormats || 'pdf,doc,docx',
      sortOrder: maxOrder + 1,
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du document', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Reordonner les documents
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const { documentIds } = await request.json();

    if (!Array.isArray(documentIds)) {
      return NextResponse.json(
        { error: 'documentIds doit etre un tableau' },
        { status: 400 }
      );
    }

    // Update sort order for each document
    for (let i = 0; i < documentIds.length; i++) {
      await OpportunityDocument.update(
        { sortOrder: i },
        { where: { id: documentIds[i], opportunityId: id } }
      );
    }

    const documents = await OpportunityDocument.findAll({
      where: { opportunityId: id },
      order: [['sortOrder', 'ASC']],
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error reordering documents:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la reorganisation des documents', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un document requis
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId est requis' },
        { status: 400 }
      );
    }

    const document = await OpportunityDocument.findOne({
      where: { id: documentId, opportunityId: id },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouve' },
        { status: 404 }
      );
    }

    await document.destroy();

    return NextResponse.json({ message: 'Document supprime avec succes' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du document', details: error.message },
      { status: 500 }
    );
  }
}
