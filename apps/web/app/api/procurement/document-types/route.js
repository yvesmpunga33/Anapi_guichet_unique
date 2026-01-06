import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { ProcurementDocumentType } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des types de documents
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const isActive = searchParams.get('isActive');
    const isRequired = searchParams.get('isRequired');

    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (isActive !== null && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    if (isRequired !== null && isRequired !== '') {
      where.isRequired = isRequired === 'true';
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await ProcurementDocumentType.findAndCountAll({
      where,
      limit,
      offset,
      order: [['category', 'ASC'], ['sortOrder', 'ASC'], ['name', 'ASC']],
    });

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching document types:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des types de documents', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer un type de document
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.code || !body.name) {
      return NextResponse.json(
        { error: 'Le code et le nom sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier l'unicité du code
    const existing = await ProcurementDocumentType.findOne({
      where: { code: body.code.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Un type de document avec ce code existe deja' },
        { status: 400 }
      );
    }

    // Créer le type de document
    const documentType = await ProcurementDocumentType.create({
      code: body.code.toUpperCase(),
      name: body.name,
      description: body.description || null,
      category: body.category || 'OTHER',
      isRequired: body.isRequired ?? false,
      validityPeriod: body.validityPeriod || null,
      maxFileSize: body.maxFileSize || 10,
      allowedFormats: body.allowedFormats || ['pdf', 'jpg', 'png', 'doc', 'docx'],
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive ?? true,
    });

    return NextResponse.json({
      success: true,
      data: documentType,
      message: 'Type de document cree avec succes',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating document type:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du type de document', details: error.message },
      { status: 500 }
    );
  }
}
