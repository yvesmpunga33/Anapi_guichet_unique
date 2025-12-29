import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Investor, Investment } from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des investisseurs
export async function GET(request) {
  try {
    const session = await auth();
    console.log('[API Investors] Session:', session ? 'authenticated' : 'null');

    if (!session) {
      // Pour le développement, on peut temporairement permettre l'accès sans auth
      // return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
      console.log('[API Investors] No session, but continuing for development...');
    }

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

    // Temporarily remove Investment include to debug
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
    console.error('Error fetching investors:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des investisseurs' },
      { status: 500 }
    );
  }
}

// POST - Creer un investisseur
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();

    // Generate investor code
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
    const investorCode = `INV-${year}-${String(nextNumber).padStart(5, '0')}`;

    const investor = await Investor.create({
      ...body,
      investorCode,
      createdById: session.user.id,
    });

    return NextResponse.json(investor, { status: 201 });
  } catch (error) {
    console.error('Error creating investor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de l\'investisseur' },
      { status: 500 }
    );
  }
}
