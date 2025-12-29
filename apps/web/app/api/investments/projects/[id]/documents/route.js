import { NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import ProjectDocument from '../../../../../../models/ProjectDocument.js';
import Investment from '../../../../../../models/Investment.js';

// GET - Liste des documents d'un projet
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Verify project exists
    const project = await Investment.findByPk(id);
    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouve' },
        { status: 404 }
      );
    }

    const documents = await ProjectDocument.findAll({
      where: { projectId: id },
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des documents' },
      { status: 500 }
    );
  }
}

// POST - Ajouter un document
export async function POST(request, { params }) {
  try {
    const { id } = await params;

    // Verify project exists
    const project = await Investment.findByPk(id);
    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouve' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const name = formData.get('name') || file?.name;
    const description = formData.get('description') || '';
    const category = formData.get('category') || 'other';

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorise. Utilisez PDF, images, Word ou Excel.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux. Maximum 10MB.' },
        { status: 400 }
      );
    }

    // Determine file type category
    let fileType = 'other';
    if (file.type === 'application/pdf') {
      fileType = 'pdf';
    } else if (file.type.startsWith('image/')) {
      fileType = 'image';
    } else if (file.type.includes('word') || file.type.includes('document')) {
      fileType = 'document';
    } else if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
      fileType = 'spreadsheet';
    }

    // Create upload directory if not exists
    const uploadDir = path.join(process.cwd(), 'public', 'investisseur', 'dossiers', id);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const safeFileName = file.name
      .replace(extension, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 50);
    const fileName = `${timestamp}_${safeFileName}${extension}`;
    const filePath = path.join(uploadDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create database record
    const document = await ProjectDocument.create({
      projectId: id,
      name: name || file.name,
      originalName: file.name,
      description,
      type: fileType,
      category,
      mimeType: file.type,
      size: file.size,
      path: `/investisseur/dossiers/${id}/${fileName}`,
      url: `/investisseur/dossiers/${id}/${fileName}`,
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du document' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un document
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'ID du document requis' },
        { status: 400 }
      );
    }

    const document = await ProjectDocument.findOne({
      where: { id: documentId, projectId: id },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouve' },
        { status: 404 }
      );
    }

    // Delete file from disk
    try {
      const filePath = path.join(process.cwd(), 'public', document.path);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
    }

    // Delete database record
    await document.destroy();

    return NextResponse.json({ message: 'Document supprime avec succes' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du document' },
      { status: 500 }
    );
  }
}
