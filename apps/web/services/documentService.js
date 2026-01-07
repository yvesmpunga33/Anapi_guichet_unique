import { NextResponse } from 'next/server';
import { auth } from '../app/lib/auth.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Service pour la gestion des documents
 * Contient toute la logique métier pour l'upload et la gestion des fichiers
 */

const UPLOAD_BASE_DIR = path.join(process.cwd(), 'public', 'uploads');

// Upload un document
export async function uploadDocument(request, { folder = 'documents', allowedTypes = null, maxSize = 10 * 1024 * 1024 } = {}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Validation de la taille
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Fichier trop volumineux. Maximum: ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validation du type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Type de fichier non autorise. Types acceptes: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await saveFile(file, folder);

    return NextResponse.json({
      success: true,
      data: result,
    }, { status: 201 });
  } catch (error) {
    console.error('[DocumentService] Error uploading document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du document', details: error.message },
      { status: 500 }
    );
  }
}

// Upload plusieurs documents
export async function uploadMultipleDocuments(request, { folder = 'documents', allowedTypes = null, maxSize = 10 * 1024 * 1024 } = {}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;

      // Validation de la taille
      if (file.size > maxSize) {
        errors.push({ filename: file.name, error: 'Fichier trop volumineux' });
        continue;
      }

      // Validation du type
      if (allowedTypes && !allowedTypes.includes(file.type)) {
        errors.push({ filename: file.name, error: 'Type non autorise' });
        continue;
      }

      try {
        const result = await saveFile(file, folder);
        results.push(result);
      } catch (err) {
        errors.push({ filename: file.name, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
    }, { status: 201 });
  } catch (error) {
    console.error('[DocumentService] Error uploading documents:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload des documents', details: error.message },
      { status: 500 }
    );
  }
}

// Supprimer un document
export async function deleteDocument(filepath) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    // Securite: empecher la suppression en dehors du dossier uploads
    const fullPath = path.join(process.cwd(), 'public', filepath);
    if (!fullPath.startsWith(UPLOAD_BASE_DIR)) {
      return NextResponse.json({ error: 'Chemin invalide' }, { status: 400 });
    }

    await fs.unlink(fullPath);

    return NextResponse.json({ success: true, message: 'Document supprime' });
  } catch (error) {
    console.error('[DocumentService] Error deleting document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du document' },
      { status: 500 }
    );
  }
}

// Helper: Sauvegarder un fichier
async function saveFile(file, folder) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generer un nom de fichier unique
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = path.extname(file.name);
  const safeBasename = path.basename(file.name, extension).replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${timestamp}_${randomStr}_${safeBasename}${extension}`;

  // Creer le dossier si necessaire
  const uploadDir = path.join(UPLOAD_BASE_DIR, folder);
  await fs.mkdir(uploadDir, { recursive: true });

  // Sauvegarder le fichier
  const filepath = path.join(uploadDir, filename);
  await fs.writeFile(filepath, buffer);

  // Chemin relatif pour l'acces web
  const webPath = `/uploads/${folder}/${filename}`;

  return {
    filename,
    originalName: file.name,
    filepath: webPath,
    mimetype: file.type,
    size: file.size,
  };
}

// Helper: Determiner le type de document
export function getDocumentType(mimetype) {
  if (mimetype?.startsWith('image/')) return 'image';
  if (mimetype?.startsWith('video/')) return 'video';
  if (mimetype?.startsWith('audio/')) return 'audio';
  if (mimetype === 'application/pdf') return 'pdf';
  if (mimetype?.includes('spreadsheet') || mimetype?.includes('excel')) return 'spreadsheet';
  if (mimetype?.includes('document') || mimetype?.includes('word')) return 'document';
  if (mimetype?.includes('presentation') || mimetype?.includes('powerpoint')) return 'presentation';
  return 'other';
}

// Helper: Formater la taille du fichier
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
