import { NextResponse } from 'next/server';
import { Contract, ContractType, LegalDomain } from '../../../../../models/index.js';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// GET - Détail d'un contrat
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const contract = await Contract.findByPk(id, {
      include: [
        { model: ContractType, as: 'contractType' },
        { model: LegalDomain, as: 'domain' },
      ],
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contrat non trouve' }, { status: 404 });
    }

    return NextResponse.json({ contract });
  } catch (error) {
    console.error('Error fetching contract:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du contrat' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un contrat (avec upload fichier)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    const contract = await Contract.findByPk(id);
    if (!contract) {
      return NextResponse.json({ error: 'Contrat non trouve' }, { status: 404 });
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
      const uploadDir = path.join(process.cwd(), 'uploads', 'legal', 'contracts', String(year));
      await mkdir(uploadDir, { recursive: true });

      // Nom du fichier
      const ext = path.extname(file.name);
      const fileName = `${contract.contractNumber || id}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      // Supprimer l'ancien fichier si existe
      if (contract.filePath) {
        try {
          const oldFilePath = path.join(process.cwd(), contract.filePath.replace('/uploads/', 'uploads/'));
          await unlink(oldFilePath);
        } catch (e) {
          // Ignorer si le fichier n'existe pas
        }
      }

      fileData = {
        filePath: `/uploads/legal/contracts/${year}/${fileName}`,
        fileName: file.name,
        fileSize: buffer.length,
        mimeType: file.type,
        checksum,
      };
    } else if (data.removeFile && contract.filePath) {
      // Supprimer le fichier existant
      try {
        const oldFilePath = path.join(process.cwd(), contract.filePath.replace('/uploads/', 'uploads/'));
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
    const dateFields = ['signingDate', 'effectiveDate', 'expirationDate', 'terminationDate'];
    dateFields.forEach(field => {
      if (data[field] === '' || data[field] === 'Invalid date' || data[field] === null) {
        data[field] = null;
      }
    });

    // Nettoyer domainId et contractTypeId vides
    if (data.domainId === '') {
      data.domainId = null;
    }
    if (data.contractTypeId === '') {
      data.contractTypeId = null;
    }

    await contract.update({
      ...data,
      ...fileData,
    });

    const result = await Contract.findByPk(id, {
      include: [
        { model: ContractType, as: 'contractType' },
        { model: LegalDomain, as: 'domain' },
      ],
    });

    return NextResponse.json({ contract: result });
  } catch (error) {
    console.error('Error updating contract:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour du contrat' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un contrat
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const contract = await Contract.findByPk(id);
    if (!contract) {
      return NextResponse.json({ error: 'Contrat non trouve' }, { status: 404 });
    }

    // Supprimer le fichier associé
    if (contract.filePath) {
      try {
        const filePath = path.join(process.cwd(), contract.filePath.replace('/uploads/', 'uploads/'));
        await unlink(filePath);
      } catch (e) {
        // Ignorer si le fichier n'existe pas
      }
    }

    await contract.destroy();

    return NextResponse.json({ message: 'Contrat supprime avec succes' });
  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du contrat' },
      { status: 500 }
    );
  }
}
