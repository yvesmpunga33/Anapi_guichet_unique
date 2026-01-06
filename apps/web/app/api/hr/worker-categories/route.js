import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { WorkerCategory, Employee } from '../../../../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import { fn, col } from 'sequelize';

// GET /api/hr/worker-categories
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const categories = await WorkerCategory.findAll({
      order: [['name', 'ASC']],
    });

    // Get employee counts for each category
    const employeeCounts = await Employee.findAll({
      attributes: [
        'categoryId',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['categoryId'],
      raw: true,
    });

    const countMap = new Map(
      employeeCounts.map((ec) => [ec.categoryId, parseInt(ec.count)])
    );

    const categoriesWithCounts = categories.map((c) => ({
      ...c.toJSON(),
      employeeCount: countMap.get(c.id) || 0,
    }));

    return NextResponse.json({
      categories: categoriesWithCounts,
    });
  } catch (error) {
    console.error('Error fetching worker categories:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}

// POST /api/hr/worker-categories
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { code, name, description, baseSalary, currency, isActive } = body;

    if (!code || !name) {
      return NextResponse.json(
        { error: 'Code et nom sont requis' },
        { status: 400 }
      );
    }

    const category = await WorkerCategory.create({
      id: uuidv4(),
      code,
      name,
      description: description || null,
      baseSalary: baseSalary || 0,
      currency: currency || 'CDF',
      isActive: isActive !== false,
    });

    return NextResponse.json({ category: category.toJSON() }, { status: 201 });
  } catch (error) {
    console.error('Error creating worker category:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json(
        { error: 'Une catégorie avec ce code existe déjà' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}
