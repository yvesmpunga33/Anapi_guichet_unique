import { NextResponse } from 'next/server';
import { auth } from '../app/lib/auth.js';
import { Investor } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Service pour la gestion des investisseurs
 * Contient toute la logique métier séparée des routes
 */

// GET - Liste des investisseurs
export async function getInvestors(request) {
  try {
    const session = await auth();
    console.log('[InvestorService] getInvestors - Session:', session ? 'authenticated' : 'null');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { investorCode: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (type && type !== 'all') {
      where.type = type;
    }

    const { count, rows: investors } = await Investor.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // Calculate totals for each investor
    const investorsWithTotals = investors.map(investor => {
      const inv = investor.toJSON();
      const investments = inv.investments || [];
      return {
        ...inv,
        totalInvestments: investments.length,
        totalAmount: investments.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0),
        currency: 'USD',
      };
    });

    // Calculate stats
    const allInvestors = await Investor.findAll();
    const stats = {
      total: allInvestors.length,
      active: allInvestors.filter(i => i.status === 'ACTIVE').length,
      verified: allInvestors.filter(i => i.isVerified).length,
      pending: allInvestors.filter(i => i.status === 'PENDING').length,
    };

    return NextResponse.json({
      investors: investorsWithTotals,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
      stats,
    });
  } catch (error) {
    console.error('[InvestorService] Error fetching investors:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des investisseurs' },
      { status: 500 }
    );
  }
}

// POST - Creer un investisseur
export async function createInvestor(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();
    const investorCode = await generateInvestorCode();

    const investor = await Investor.create({
      ...body,
      investorCode,
      createdById: session.user.id,
    });

    return NextResponse.json(investor, { status: 201 });
  } catch (error) {
    console.error('[InvestorService] Error creating investor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de l\'investisseur' },
      { status: 500 }
    );
  }
}

// GET - Obtenir un investisseur par ID
export async function getInvestorById(investorId) {
  try {
    const investor = await Investor.findByPk(investorId);

    if (!investor) {
      return NextResponse.json(
        { error: 'Investisseur non trouve' },
        { status: 404 }
      );
    }

    return NextResponse.json(investor);
  } catch (error) {
    console.error('[InvestorService] Error fetching investor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de l\'investisseur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour un investisseur
export async function updateInvestor(investorId, request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();
    const investor = await Investor.findByPk(investorId);

    if (!investor) {
      return NextResponse.json(
        { error: 'Investisseur non trouve' },
        { status: 404 }
      );
    }

    await investor.update(body);

    return NextResponse.json(investor);
  } catch (error) {
    console.error('[InvestorService] Error updating investor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de l\'investisseur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un investisseur
export async function deleteInvestor(investorId) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const investor = await Investor.findByPk(investorId);

    if (!investor) {
      return NextResponse.json(
        { error: 'Investisseur non trouve' },
        { status: 404 }
      );
    }

    await investor.destroy();

    return NextResponse.json({ message: 'Investisseur supprime avec succes' });
  } catch (error) {
    console.error('[InvestorService] Error deleting investor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'investisseur' },
      { status: 500 }
    );
  }
}

// Helper: Generate investor code
async function generateInvestorCode() {
  const lastInvestor = await Investor.findOne({
    order: [['createdAt', 'DESC']],
  });

  let nextNumber = 1;
  if (lastInvestor && lastInvestor.investorCode) {
    const match = lastInvestor.investorCode.match(/INV-\d{4}-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  const year = new Date().getFullYear();
  return `INV-${year}-${String(nextNumber).padStart(5, '0')}`;
}
