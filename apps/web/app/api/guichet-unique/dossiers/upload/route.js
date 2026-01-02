import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth.js';
import { Dossier, DossierDocument, DossierSector, Sector, sequelize } from '../../../../../models/index.js';
import { Op } from 'sequelize';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Generer un numero de dossier unique
async function generateDossierNumber() {
  const year = new Date().getFullYear();
  const prefix = 'DOS';

  const lastDossier = await Dossier.findOne({
    where: {
      dossierNumber: {
        [Op.like]: `${prefix}-${year}-%`
      }
    },
    order: [['dossierNumber', 'DESC']]
  });

  let nextNumber = 1;
  if (lastDossier) {
    const lastNumber = parseInt(lastDossier.dossierNumber.split('-')[2], 10);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}-${year}-${String(nextNumber).padStart(5, '0')}`;
}

// POST - Creer un nouveau dossier avec upload de fichiers
export async function POST(request) {
  const transaction = await sequelize.transaction();

  try {
    const session = await auth();
    const formData = await request.formData();

    // Extraire les données JSON du formulaire
    const dataJson = formData.get('data');
    if (!dataJson) {
      return NextResponse.json(
        { error: 'Données du formulaire manquantes' },
        { status: 400 }
      );
    }

    const data = JSON.parse(dataJson);

    // Generer le numero de dossier
    const dossierNumber = await generateDossierNumber();

    // Extraire les secteurs (tableau d'IDs)
    const sectorIds = data.sectors || [];
    const primarySector = sectorIds.length > 0 ? sectorIds[0] : null;

    // Trouver le premier secteur pour la compatibilité avec le champ legacy
    let sectorName = data.subSector || '';
    if (primarySector) {
      const sector = await Sector.findByPk(primarySector);
      if (sector) {
        sectorName = sector.name;
      }
    }

    // Creer le dossier
    const dossier = await Dossier.create({
      dossierNumber,
      dossierType: data.dossierType,
      // Investor info
      investorType: data.investorType || 'company',
      investorName: data.investorName,
      rccm: data.rccm,
      idNat: data.idNat,
      nif: data.nif,
      investorEmail: data.email,
      investorPhone: data.phone,
      investorProvince: data.investorProvince || null,
      investorProvinceId: data.investorProvinceId || null,
      investorCity: data.investorCity || null,
      investorCityId: data.investorCityId || null,
      investorCommune: data.investorCommune || null,
      investorCommuneId: data.investorCommuneId || null,
      investorAddress: data.address,
      investorCountry: data.country || 'RDC',
      // Representant legal
      representativeName: data.representativeName || null,
      representativeFunction: data.representativeFunction || null,
      representativePhone: data.representativePhone || null,
      representativeEmail: data.representativeEmail || null,
      // Investisseur existant
      investorId: data.investorId || null,
      // Project info
      projectName: data.projectName,
      projectDescription: data.projectDescription,
      sector: sectorName,
      subSector: data.subSector,
      projectProvince: data.projectProvince || null,
      projectProvinceId: data.projectProvinceId || null,
      projectCity: data.projectCity || null,
      projectCityId: data.projectCityId || null,
      projectCommune: data.projectCommune || null,
      projectCommuneId: data.projectCommuneId || null,
      projectAddress: data.projectAddress,
      // Financial info
      investmentAmount: parseFloat(String(data.investmentAmount || '0').replace(/[^0-9.-]/g, '')) || 0,
      currency: data.currency || 'USD',
      directJobs: parseInt(data.directJobs) || 0,
      indirectJobs: parseInt(data.indirectJobs) || 0,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      // Status
      status: data.isDraft ? 'DRAFT' : 'SUBMITTED',
      submittedAt: data.isDraft ? null : new Date(),
      createdById: session?.user?.id || null,
    }, { transaction });

    // Creer les associations dossier-secteurs
    if (sectorIds.length > 0) {
      const dossierSectors = sectorIds.map((sectorId, index) => ({
        dossierId: dossier.id,
        sectorId,
        isPrimary: index === 0,
      }));

      await DossierSector.bulkCreate(dossierSectors, { transaction });
    }

    // Traiter les fichiers uploadés
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'guichet-unique', 'dossiers', dossier.id);
    await mkdir(uploadDir, { recursive: true });

    const uploadedDocuments = [];

    // Parcourir tous les champs du FormData pour trouver les fichiers
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('documents[') && value instanceof File) {
        // Extraire l'ID du type de document: documents[uuid] -> uuid
        const docTypeId = key.match(/documents\[([^\]]+)\]/)?.[1];

        if (docTypeId && value.size > 0) {
          const file = value;
          const fileExtension = path.extname(file.name);
          const uniqueFileName = `${Date.now()}_${uuidv4()}${fileExtension}`;
          const filePath = path.join(uploadDir, uniqueFileName);

          // Convertir le fichier en buffer et l'écrire
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          await writeFile(filePath, buffer);

          // Créer l'entrée dans la base de données
          const document = await DossierDocument.create({
            dossierId: dossier.id,
            documentTypeId: docTypeId,
            name: file.name.replace(fileExtension, ''),
            fileName: uniqueFileName,
            originalName: file.name,
            filePath: `/uploads/guichet-unique/dossiers/${dossier.id}/${uniqueFileName}`,
            mimeType: file.type,
            fileSize: file.size,
            category: 'required',
            uploadedById: session?.user?.id || null,
          }, { transaction });

          uploadedDocuments.push(document);
        }
      }
    }

    await transaction.commit();

    // Récupérer le dossier avec ses secteurs et documents
    const dossierWithRelations = await Dossier.findByPk(dossier.id, {
      include: [
        {
          model: Sector,
          as: 'sectors',
          through: { attributes: ['isPrimary'] },
        },
        {
          model: DossierDocument,
          as: 'documents',
        },
      ],
    });

    return NextResponse.json({
      success: true,
      dossier: dossierWithRelations,
      documentsUploaded: uploadedDocuments.length,
      message: data.isDraft
        ? 'Brouillon enregistre avec succes'
        : `Dossier soumis avec succes (${uploadedDocuments.length} document(s) uploade(s))`,
    }, { status: 201 });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating dossier with files:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du dossier', details: error.message },
      { status: 500 }
    );
  }
}
