import { NextResponse } from 'next/server';
import { Contract, ContractType, LegalDomain, sequelize } from '../../../../models/index.js';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { Op } from 'sequelize';

// Générer un numéro de contrat unique
async function generateContractNumber() {
  const year = new Date().getFullYear();
  const prefix = `CONTRAT-${year}`;

  const lastContract = await Contract.findOne({
    where: {
      contractNumber: { [Op.like]: `${prefix}-%` }
    },
    order: [['contractNumber', 'DESC']],
  });

  let nextNumber = 1;
  if (lastContract) {
    const match = lastContract.contractNumber.match(/-(\d+)$/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }

  return `${prefix}-${String(nextNumber).padStart(5, '0')}`;
}

// GET - Liste des contrats
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const status = searchParams.get('status');
    const typeId = searchParams.get('typeId');
    const expiring = searchParams.get('expiring'); // Nombre de jours

    const where = {};
    if (status) where.status = status;
    if (typeId) where.typeId = typeId;

    // Contrats expirant dans X jours
    if (expiring) {
      const days = parseInt(expiring);
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      where.endDate = {
        [Op.between]: [new Date(), futureDate]
      };
      where.status = 'ACTIVE';
    }

    const { count, rows: contracts } = await Contract.findAndCountAll({
      where,
      include: [
        { model: ContractType, as: 'contractType' },
        { model: LegalDomain, as: 'domain' },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    return NextResponse.json({
      contracts,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des contrats' },
      { status: 500 }
    );
  }
}

// POST - Créer un contrat (avec upload fichier)
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

    // Générer le numéro de contrat
    const contractNumber = await generateContractNumber();

    // Traiter le fichier si présent
    let fileData = {};
    if (file && file instanceof File) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const year = new Date().getFullYear();
      const uploadDir = path.join(process.cwd(), 'uploads', 'legal', 'contracts', String(year));
      await mkdir(uploadDir, { recursive: true });

      const ext = path.extname(file.name);
      const fileName = `${contractNumber}${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      fileData = {
        filePath: `/uploads/legal/contracts/${year}/${fileName}`,
        fileName: file.name,
        fileSize: buffer.length,
      };
    }

    // Créer le contrat
    const contract = await Contract.create({
      ...data,
      contractNumber,
      ...fileData,
      status: data.status || 'DRAFT',
    }, { transaction });

    await transaction.commit();

    const result = await Contract.findByPk(contract.id, {
      include: [
        { model: ContractType, as: 'contractType' },
        { model: LegalDomain, as: 'domain' },
      ],
    });

    return NextResponse.json({ contract: result }, { status: 201 });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du contrat' },
      { status: 500 }
    );
  }
}
