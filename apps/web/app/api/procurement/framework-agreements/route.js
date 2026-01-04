import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { FrameworkAgreement, FrameworkAgreementSupplier, Bidder, Tender, Ministry, User, sequelize } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des accords-cadres
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';

    const where = {};

    if (search) {
      where[Op.or] = [
        { agreementNumber: { [Op.iLike]: `%${search}%` } },
        { title: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await FrameworkAgreement.findAndCountAll({
      where,
      include: [
        { model: Tender, as: 'tender', attributes: ['id', 'reference', 'title'] },
        { model: Ministry, as: 'ministry', attributes: ['id', 'name', 'shortName'] },
        {
          model: FrameworkAgreementSupplier,
          as: 'suppliers',
          include: [
            { model: Bidder, as: 'bidder', attributes: ['id', 'companyName'] }
          ]
        },
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      distinct: true,
    });

    // Statistiques
    const stats = await FrameworkAgreement.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('max_value')), 'totalValue'],
        [sequelize.fn('SUM', sequelize.col('used_value')), 'usedValue'],
      ],
      group: ['status'],
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
      stats,
    });
  } catch (error) {
    console.error('Error fetching framework agreements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des accords-cadres', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer un accord-cadre
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();

    // Validation
    if (!body.title || !body.category || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Le titre, la catégorie, et les dates sont obligatoires' },
        { status: 400 }
      );
    }

    // Générer le numéro d'accord-cadre
    const year = new Date().getFullYear();
    const count = await FrameworkAgreement.count({
      where: sequelize.where(
        sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "created_at"')),
        year
      ),
    });

    const agreementNumber = `AC-${year}-${(count + 1).toString().padStart(4, '0')}`;

    const agreement = await FrameworkAgreement.create({
      agreementNumber,
      title: body.title,
      description: body.description,
      tenderId: body.tenderId,
      ministryId: body.ministryId,
      category: body.category,
      subCategory: body.subCategory,
      type: body.type || 'SINGLE_SUPPLIER',
      startDate: body.startDate,
      endDate: body.endDate,
      isRenewable: body.isRenewable || false,
      maxRenewals: body.maxRenewals || 1,
      renewalPeriodMonths: body.renewalPeriodMonths || 12,
      maxValue: body.maxValue,
      minOrderValue: body.minOrderValue,
      maxOrderValue: body.maxOrderValue,
      currency: body.currency || 'USD',
      priceRevisionClause: body.priceRevisionClause,
      priceRevisionIndex: body.priceRevisionIndex,
      deliveryTerms: body.deliveryTerms,
      paymentTerms: body.paymentTerms,
      warrantyTerms: body.warrantyTerms,
      penaltyClause: body.penaltyClause,
      hasCatalog: body.hasCatalog || false,
      catalogItems: body.catalogItems || [],
      alertDays: body.alertDays || 30,
      notes: body.notes,
      createdById: session.user.id,
    });

    // Ajouter les fournisseurs si fournis
    if (body.suppliers && body.suppliers.length > 0) {
      for (let i = 0; i < body.suppliers.length; i++) {
        const supplier = body.suppliers[i];
        await FrameworkAgreementSupplier.create({
          agreementId: agreement.id,
          bidderId: supplier.bidderId,
          rank: supplier.rank || i + 1,
          specificDiscount: supplier.specificDiscount,
          specificTerms: supplier.specificTerms,
          maxValue: supplier.maxValue,
          addedById: session.user.id,
        });
      }
    }

    const result = await FrameworkAgreement.findByPk(agreement.id, {
      include: [
        { model: Tender, as: 'tender', attributes: ['id', 'reference', 'title'] },
        {
          model: FrameworkAgreementSupplier,
          as: 'suppliers',
          include: [
            { model: Bidder, as: 'bidder', attributes: ['id', 'companyName'] }
          ]
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Accord-cadre créé avec succès',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating framework agreement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'accord-cadre', details: error.message },
      { status: 500 }
    );
  }
}
