import { NextResponse } from 'next/server';
import { auth } from '../../lib/auth';
import { User } from '../../../models';

// GET /api/users - Liste tous les utilisateurs
export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'role', 'isActive', 'image', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}
