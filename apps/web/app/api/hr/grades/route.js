import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { SalaryGrade } from '../../../../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// GET /api/hr/grades
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const grades = await SalaryGrade.findAll({
      order: [['level', 'ASC']],
    });

    return NextResponse.json({
      grades: grades.map((g) => g.toJSON()),
    });
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des grades' },
      { status: 500 }
    );
  }
}

// POST /api/hr/grades
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { code, name, description, minSalary, maxSalary, currency, level, isActive } = body;

    if (!code || !name) {
      return NextResponse.json(
        { error: 'Code et nom sont requis' },
        { status: 400 }
      );
    }

    const grade = await SalaryGrade.create({
      id: uuidv4(),
      code,
      name,
      description: description || null,
      minSalary: minSalary || 0,
      maxSalary: maxSalary || 0,
      currency: currency || 'CDF',
      level: level || 1,
      isActive: isActive !== false,
    });

    return NextResponse.json({ grade: grade.toJSON() }, { status: 201 });
  } catch (error) {
    console.error('Error creating grade:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json(
        { error: 'Un grade avec ce code existe déjà' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création du grade' },
      { status: 500 }
    );
  }
}
