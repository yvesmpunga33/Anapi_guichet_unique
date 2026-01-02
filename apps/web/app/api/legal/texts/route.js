import { NextResponse } from 'next/server';
import { JuridicalText, LegalDocumentType, LegalDomain, sequelize } from '../../../../models/index.js';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Générer un numéro de document unique
async function generateDocumentNumber(typeCode) {
  const year = new Date().getFullYear();
  const prefix = `${typeCode}-${year}`;

  const lastDoc = await JuridicalText.findOne({
    where: sequelize.where(
      sequelize.fn('LIKE', sequelize.col('documentNumber'), `${prefix}-%`)
    ),
    order: [['documentNumber', 'DESC']],
  });

  let nextNumber = 1;
  if (lastDoc) {
    const match = lastDoc.documentNumber.match(/-(\d+)$/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }

  return `${prefix}-${String(nextNumber).padStart(5, '0')}`;
}

// GET - Liste des textes juridiques
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');
    const typeId = searchParams.get('typeId');
    const domainId = searchParams.get('domainId');
    const search = searchParams.get('search');

    const where = { isCurrentVersion: true };
    if (status) where.status = status;
    if (typeId) where.typeId = typeId;
    if (domainId) where.domainId = domainId;
    if (search) {
      where[sequelize.Op.or] = [
        { title: { [sequelize.Op.iLike]: `%${search}%` } },
        { officialReference: { [sequelize.Op.iLike]: `%${search}%` } },
        { summary: { [sequelize.Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows: texts } = await JuridicalText.findAndCountAll({
      where,
      include: [
        { model: LegalDocumentType, as: 'documentType' },
        { model: LegalDomain, as: 'domain' },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return NextResponse.json({
      texts,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching texts:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des textes' },
      { status: 500 }
    );
  }
}

// POST - Créer un texte juridique (avec upload fichier)
export async function POST(request) {
  const transaction = await sequelize.transaction();

  try {
    const formData = await request.formData();
    const dataJson = formData.get('data');
    const file = formData.get('file');

    if (!dataJson) {
      return NextResponse.json({ error: 'Donnees manquantes' }, { status: 400 });
    }

    const data = JSON.parse(dataJson);

    // Récupérer le type pour générer le numéro
    const docType = await LegalDocumentType.findByPk(data.typeId);
    if (!docType) {
      return NextResponse.json({ error: 'Type de document invalide' }, { status: 400 });
    }

    // Générer le numéro de document
    const documentNumber = await generateDocumentNumber(docType.code);

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
      const fileName = `${documentNumber}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      fileData = {
        filePath: `/uploads/legal/texts/${year}/${fileName}`,
        fileName: file.name,
        fileSize: buffer.length,
        mimeType: file.type,
        checksum,
      };
    }

    // Créer le document
    const text = await JuridicalText.create({
      ...data,
      documentNumber,
      ...fileData,
      status: data.status || 'DRAFT',
    }, { transaction });

    await transaction.commit();

    // Recharger avec les relations
    const result = await JuridicalText.findByPk(text.id, {
      include: [
        { model: LegalDocumentType, as: 'documentType' },
        { model: LegalDomain, as: 'domain' },
      ],
    });

    return NextResponse.json({ text: result }, { status: 201 });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating text:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du texte' },
      { status: 500 }
    );
  }
}
