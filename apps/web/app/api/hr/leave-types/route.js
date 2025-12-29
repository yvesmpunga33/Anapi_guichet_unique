import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { LeaveType } from '../../../../models/index.js';

// GET /api/hr/leave-types - Liste tous les types de congés
export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const leaveTypes = await LeaveType.findAll({
      order: [['name', 'ASC']],
    });

    return NextResponse.json(leaveTypes);
  } catch (error) {
    console.error('Error fetching leave types:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des types de congés' },
      { status: 500 }
    );
  }
}

// POST /api/hr/leave-types - Créer un type de congé
export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code, name, description, defaultDays, isPaid, requiresApproval } = body;

    if (!code || !name) {
      return NextResponse.json(
        { error: 'Code et nom requis' },
        { status: 400 }
      );
    }

    const leaveType = await LeaveType.create({
      code,
      name,
      description,
      defaultDays: defaultDays || 0,
      isPaid: isPaid !== false,
      requiresApproval: requiresApproval !== false,
      isActive: true,
    });

    return NextResponse.json(leaveType, { status: 201 });
  } catch (error) {
    console.error('Error creating leave type:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du type de congé' },
      { status: 500 }
    );
  }
}
