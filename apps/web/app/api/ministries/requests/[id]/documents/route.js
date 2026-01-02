import { NextResponse } from 'next/server';
import { MinistryRequest, MinistryRequestDocument, MinistryWorkflow } from '../../../../../../models/index.js';
import { auth } from '../../../../../lib/auth.js';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// GET - Liste des documents d'une demande
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const documents = await MinistryRequestDocument.findAll({
      where: { requestId: id },
      order: [['createdAt', 'DESC']],
    });

    // Recuperer aussi les documents requis depuis le workflow
    const ministryRequest = await MinistryRequest.findByPk(id);
    if (!ministryRequest) {
      return NextResponse.json(
        { error: 'Demande non trouvee' },
        { status: 404 }
      );
    }

    // Obtenir les documents requis pour cette etape du workflow
    const currentWorkflow = await MinistryWorkflow.findOne({
      where: {
        ministryId: ministryRequest.ministryId,
        requestType: ministryRequest.requestType,
        stepNumber: ministryRequest.currentStep,
        isActive: true,
      },
    });

    // Tous les documents requis de toutes les etapes
    const allWorkflowSteps = await MinistryWorkflow.findAll({
      where: {
        ministryId: ministryRequest.ministryId,
        requestType: ministryRequest.requestType,
        isActive: true,
      },
      order: [['stepNumber', 'ASC']],
    });

    const requiredDocuments = allWorkflowSteps.flatMap(step =>
      (step.requiredDocuments || []).map(doc => ({
        ...doc,
        stepNumber: step.stepNumber,
        stepName: step.stepName,
      }))
    );

    return NextResponse.json({
      success: true,
      data: documents,
      requiredDocuments,
      currentStepDocuments: currentWorkflow?.requiredDocuments || [],
    });
  } catch (error) {
    console.error('Error fetching request documents:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Demander des documents ou uploader un document
export async function POST(request, { params }) {
  try {
    const session = await auth();
    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';

    const ministryRequest = await MinistryRequest.findByPk(id);
    if (!ministryRequest) {
      return NextResponse.json(
        { error: 'Demande non trouvee' },
        { status: 404 }
      );
    }

    // Si c'est un upload de fichier
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      const documentId = formData.get('documentId');

      if (!file) {
        return NextResponse.json(
          { error: 'Aucun fichier fourni' },
          { status: 400 }
        );
      }

      // Creer le dossier uploads si necessaire
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'ministry-documents', id);
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Generer un nom unique pour le fichier
      const timestamp = Date.now();
      const originalName = file.name;
      const extension = path.extname(originalName);
      const fileName = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadsDir, fileName);

      // Sauvegarder le fichier
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      const fileUrl = `/uploads/ministry-documents/${id}/${fileName}`;

      // Si on met a jour un document existant
      if (documentId) {
        const doc = await MinistryRequestDocument.findByPk(documentId);
        if (doc) {
          await doc.update({
            status: 'UPLOADED',
            fileName: originalName,
            fileUrl,
            fileSize: buffer.length,
            mimeType: file.type,
            uploadedAt: new Date(),
            uploadedById: session?.user?.id,
            uploadedByName: session?.user?.name,
          });

          return NextResponse.json({
            success: true,
            message: 'Document uploade avec succes',
            data: doc,
          });
        }
      }

      // Creer un nouveau document
      const documentName = formData.get('documentName') || originalName;
      const documentType = formData.get('documentType') || 'OTHER';

      const newDoc = await MinistryRequestDocument.create({
        requestId: id,
        documentType,
        documentName,
        status: 'UPLOADED',
        fileName: originalName,
        fileUrl,
        fileSize: buffer.length,
        mimeType: file.type,
        uploadedAt: new Date(),
        uploadedById: session?.user?.id,
        uploadedByName: session?.user?.name,
      });

      return NextResponse.json({
        success: true,
        message: 'Document uploade avec succes',
        data: newDoc,
      }, { status: 201 });
    }

    // Si c'est une demande de documents (action HOLD)
    const data = await request.json();
    const { documents, note } = data;

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json(
        { error: 'Liste de documents requise' },
        { status: 400 }
      );
    }

    // Creer les enregistrements de documents demandes
    const createdDocs = [];
    for (const doc of documents) {
      const newDoc = await MinistryRequestDocument.create({
        requestId: id,
        documentType: doc.type || doc.id || 'CUSTOM',
        documentName: doc.name,
        description: doc.description,
        isRequired: doc.isRequired !== false,
        requestedAtStep: ministryRequest.currentStep,
        requestedById: session?.user?.id,
        requestedByName: session?.user?.name,
        requestedAt: new Date(),
        requestNote: note,
        status: 'PENDING',
      });
      createdDocs.push(newDoc);
    }

    return NextResponse.json({
      success: true,
      message: `${createdDocs.length} document(s) demande(s)`,
      data: createdDocs,
    }, { status: 201 });

  } catch (error) {
    console.error('Error handling document request:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement', details: error.message },
      { status: 500 }
    );
  }
}
