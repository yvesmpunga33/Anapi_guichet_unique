import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Position, HRDepartment, SalaryGrade } from '../../../../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// GET /api/hr/positions
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const positions = await Position.findAll({
      include: [
        { model: HRDepartment, as: 'department', attributes: ['id', 'name'] },
        { model: SalaryGrade, as: 'grade', attributes: ['id', 'name'] },
      ],
      order: [['title', 'ASC']],
    });

    return NextResponse.json({
      positions: positions.map((p) => p.toJSON()),
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des postes' },
      { status: 500 }
    );
  }
}

// POST /api/hr/positions
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { code, title, description, departmentId, gradeId, isActive } = body;

    if (!code || !title) {
      return NextResponse.json(
        { error: 'Code et titre sont requis' },
        { status: 400 }
      );
    }

    const position = await Position.create({
      id: uuidv4(),
      code,
      title,
      description: description || null,
      departmentId: departmentId || null,
      gradeId: gradeId || null,
      isActive: isActive !== false,
    });

    return NextResponse.json({ position: position.toJSON() }, { status: 201 });
  } catch (error) {
    console.error('Error creating position:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json(
        { error: 'Un poste avec ce code existe déjà' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création du poste' },
      { status: 500 }
    );
  }
}
