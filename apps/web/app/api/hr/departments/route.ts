import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth';
import { HRDepartment, Employee } from '../../../../models';

// GET /api/hr/departments - Liste tous les départements
export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const departments = await HRDepartment.findAll({
      include: [
        {
          model: HRDepartment,
          as: 'parent',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: Employee,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'matricule'],
        },
      ],
      order: [['name', 'ASC']],
    });

    return NextResponse.json({
      departments: departments.map((d) => d.toJSON()),
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des départements' },
      { status: 500 }
    );
  }
}

// POST /api/hr/departments - Créer un département
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code, name, description, parentId, managerId } = body;

    if (!code || !name) {
      return NextResponse.json(
        { error: 'Code et nom requis' },
        { status: 400 }
      );
    }

    const department = await HRDepartment.create({
      code,
      name,
      description,
      parentId: parentId || null,
      managerId: managerId || null,
      isActive: true,
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du département' },
      { status: 500 }
    );
  }
}
