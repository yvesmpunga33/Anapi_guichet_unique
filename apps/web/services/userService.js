import { NextResponse } from 'next/server';
import { auth } from '../app/lib/auth.js';
import { User } from '../models/index.js';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';

/**
 * Service pour la gestion des utilisateurs
 * Contient toute la logique métier séparée des routes
 */

// GET - Liste des utilisateurs
export async function getUsers(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (role && role !== 'all') {
      where.role = role;
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // Calculate stats
    const allUsers = await User.findAll();
    const stats = {
      total: allUsers.length,
      active: allUsers.filter(u => u.isActive).length,
      verified: allUsers.filter(u => u.isVerified).length,
      admins: allUsers.filter(u => u.role === 'admin').length,
    };

    return NextResponse.json({
      users,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
      stats,
    });
  } catch (error) {
    console.error('[UserService] Error fetching users:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des utilisateurs' },
      { status: 500 }
    );
  }
}

// GET - Obtenir un utilisateur par ID
export async function getUserById(userId) {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouve' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[UserService] Error fetching user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// POST - Creer un utilisateur
export async function createUser(request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();

    // Verifier si l'email existe deja
    const existingUser = await User.findOne({ where: { email: body.email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Cet email est deja utilise' }, { status: 400 });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await User.create({
      ...body,
      password: hashedPassword,
    });

    // Retourner sans le mot de passe
    const { password, ...userWithoutPassword } = user.toJSON();

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('[UserService] Error creating user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour un utilisateur
export async function updateUser(userId, request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    // Seul l'admin ou l'utilisateur lui-meme peut modifier
    if (session.user.role !== 'admin' && session.user.id !== userId) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 403 });
    }

    const body = await request.json();
    const user = await User.findByPk(userId);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouve' }, { status: 404 });
    }

    // Ne pas permettre de changer le role sauf si admin
    if (body.role && session.user.role !== 'admin') {
      delete body.role;
    }

    // Si le mot de passe est fourni, le hasher
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    await user.update(body);

    // Retourner sans le mot de passe
    const { password, ...userWithoutPassword } = user.toJSON();

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('[UserService] Error updating user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur
export async function deleteUser(userId) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    // Empecher la suppression de soi-meme
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      );
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouve' }, { status: 404 });
    }

    // Soft delete (desactiver plutot que supprimer)
    await user.update({ isActive: false });

    return NextResponse.json({ message: 'Utilisateur desactive avec succes' });
  } catch (error) {
    console.error('[UserService] Error deleting user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// PUT - Changer le mot de passe
export async function changePassword(userId, request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    // Seul l'utilisateur lui-meme ou un admin peut changer le mot de passe
    if (session.user.role !== 'admin' && session.user.id !== userId) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 403 });
    }

    const { currentPassword, newPassword } = await request.json();

    const user = await User.findByPk(userId);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouve' }, { status: 404 });
    }

    // Verifier le mot de passe actuel (sauf pour admin)
    if (session.user.role !== 'admin') {
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });
      }
    }

    // Hasher et mettre a jour le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return NextResponse.json({ message: 'Mot de passe modifie avec succes' });
  } catch (error) {
    console.error('[UserService] Error changing password:', error);
    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe' },
      { status: 500 }
    );
  }
}

// GET - Profil de l'utilisateur connecte
export async function getCurrentUserProfile() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const user = await User.findByPk(session.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouve' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[UserService] Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du profil' },
      { status: 500 }
    );
  }
}
