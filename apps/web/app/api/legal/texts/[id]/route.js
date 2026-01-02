import { NextResponse } from 'next/server';
import { JuridicalText, LegalDocumentType, LegalDomain } from '../../../../../models/index.js';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// GET - Détail d'un texte juridique
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const text = await JuridicalText.findByPk(id, {
      include: [
        { model: LegalDocumentType, as: 'documentType' },
        { model: LegalDomain, as: 'domain' },
      ],
    });

    if (!text) {
      return NextResponse.json({ error: 'Texte non trouve' }, { status: 404 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error fetching text:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du texte' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un texte (avec upload fichier)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    const text = await JuridicalText.findByPk(id);
    if (!text) {
      return NextResponse.json({ error: 'Texte non trouve' }, { status: 404 });
    }

    // Vérifier si c'est un FormData ou JSON
    const contentType = request.headers.get('content-type') || '';
    let data;
    let file = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const dataJson = formData.get('data');
      file = formData.get('file');
      data = JSON.parse(dataJson);
    } else {
      data = await request.json();
    }

    // Traiter le fichier si présent
    let fileData = {};
    if (file && file instanceof File) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Calculer le checksum
      const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

      // Créer le répertoire
      const year = new Date().getFullYear();
      const uploadDir = path.join(process.cwd(), 'uploads', 'legal', 'texts', String(year));
      await mkdir(uploadDir, { recursive: true });

      // Nom du fichier
      const ext = path.extname(file.name);
      const fileName = `${text.documentNumber}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      // Supprimer l'ancien fichier si existe
      if (text.filePath) {
        try {
          const oldFilePath = path.join(process.cwd(), text.filePath.replace('/uploads/', 'uploads/'));
          await unlink(oldFilePath);
        } catch (e) {
          // Ignorer si le fichier n'existe pas
        }
      }

      fileData = {
        filePath: `/uploads/legal/texts/${year}/${fileName}`,
        fileName: file.name,
        fileSize: buffer.length,
        mimeType: file.type,
        checksum,
      };
    } else if (data.removeFile && text.filePath) {
      // Supprimer le fichier existant
      try {
        const oldFilePath = path.join(process.cwd(), text.filePath.replace('/uploads/', 'uploads/'));
        await unlink(oldFilePath);
      } catch (e) {
        // Ignorer si le fichier n'existe pas
      }
      fileData = {
        filePath: null,
        fileName: null,
        fileSize: null,
        mimeType: null,
        checksum: null,
      };
    }

    // Supprimer removeFile des données
    delete data.removeFile;

    // Nettoyer les dates vides ou invalides
    const dateFields = ['publicationDate', 'effectiveDate', 'expirationDate'];
    dateFields.forEach(field => {
      if (data[field] === '' || data[field] === 'Invalid date' || data[field] === null) {
        data[field] = null;
      }
    });

    // Nettoyer domainId vide
    if (data.domainId === '') {
      data.domainId = null;
    }

    await text.update({
      ...data,
      ...fileData,
    });

    const result = await JuridicalText.findByPk(id, {
      include: [
        { model: LegalDocumentType, as: 'documentType' },
        { model: LegalDomain, as: 'domain' },
      ],
    });

    return NextResponse.json({ text: result });
  } catch (error) {
    console.error('Error updating text:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour du texte' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un texte
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const text = await JuridicalText.findByPk(id);
    if (!text) {
      return NextResponse.json({ error: 'Texte non trouve' }, { status: 404 });
    }

    // Supprimer le fichier associé
    if (text.filePath) {
      try {
        const filePath = path.join(process.cwd(), text.filePath.replace('/uploads/', 'uploads/'));
        await unlink(filePath);
      } catch (e) {
        // Ignorer si le fichier n'existe pas
      }
    }

    await text.destroy();

    return NextResponse.json({ message: 'Texte supprime avec succes' });
  } catch (error) {
    console.error('Error deleting text:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du texte' },
      { status: 500 }
    );
  }
}
