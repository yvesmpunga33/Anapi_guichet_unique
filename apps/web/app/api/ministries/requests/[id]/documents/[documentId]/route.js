import { NextResponse } from 'next/server';
import { MinistryRequestDocument } from '../../../../../../../models/index.js';
import { auth } from '../../../../../../lib/auth.js';

// GET - Details d'un document
export async function GET(request, { params }) {
  try {
    const { documentId } = await params;

    const document = await MinistryRequestDocument.findByPk(documentId);

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouve' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Valider ou rejeter un document
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    const { documentId } = await params;
    const data = await request.json();

    const document = await MinistryRequestDocument.findByPk(documentId);

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouve' },
        { status: 404 }
      );
    }

    const updateData = {};

    switch (data.action) {
      case 'VALIDATE':
        updateData.status = 'VALIDATED';
        updateData.validatedAt = new Date();
        updateData.validatedById = session?.user?.id;
        updateData.validatedByName = session?.user?.name;
        updateData.validationNote = data.note;
        break;

      case 'REJECT':
        updateData.status = 'REJECTED';
        updateData.validatedAt = new Date();
        updateData.validatedById = session?.user?.id;
        updateData.validatedByName = session?.user?.name;
        updateData.rejectionReason = data.reason || data.note;
        break;

      default:
        return NextResponse.json(
          { error: 'Action non valide' },
          { status: 400 }
        );
    }

    await document.update(updateData);

    return NextResponse.json({
      success: true,
      message: data.action === 'VALIDATE' ? 'Document valide' : 'Document rejete',
      data: document,
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un document
export async function DELETE(request, { params }) {
  try {
    const { documentId } = await params;

    const document = await MinistryRequestDocument.findByPk(documentId);

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouve' },
        { status: 404 }
      );
    }

    await document.destroy();

    return NextResponse.json({
      success: true,
      message: 'Document supprime',
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression', details: error.message },
      { status: 500 }
    );
  }
}
