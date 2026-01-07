import { NextResponse } from 'next/server';
import { auth } from '../../lib/auth.js';
import { User, Ministry } from '../../../models/index.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Generate a UUID v4
function generateUUID() {
  return crypto.randomUUID();
}

// Valeurs acceptées pour le rôle (enum PostgreSQL)
const VALID_ROLES = ['admin', 'manager', 'agent', 'investor', 'partner'];

// Parser les modules de manière sécurisée
function parseModules(modules) {
  if (!modules) return [];
  if (Array.isArray(modules)) return modules;
  if (typeof modules === 'string') {
    try {
      const parsed = JSON.parse(modules);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// GET /api/users - Liste tous les utilisateurs
export async function GET(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    const whereClause = {};

    if (role) {
      whereClause.role = role;
    }

    if (status === 'active') {
      whereClause.isActive = true;
    } else if (status === 'inactive') {
      whereClause.isActive = false;
    }

    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'role', 'isActive', 'image', 'phone', 'department', 'ministryId', 'modules', 'created_at', 'updated_at'],
      where: whereClause,
      include: [
        {
          model: Ministry,
          as: 'ministry',
          attributes: ['id', 'name', 'shortName', 'code'],
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
    });

    // Filter by search if provided
    let filteredUsers = users;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.department?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      users: filteredUsers,
      total: filteredUsers.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    );
  }
}

// POST /api/users - Créer un nouvel utilisateur
export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier le rôle admin (insensible à la casse, accepte admin/manager)
    const userRole = (session.user.role || '').toLowerCase();
    const allowedRoles = ['admin', 'super_admin', 'manager'];
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role') || 'agent';
    const department = formData.get('department');
    const phone = formData.get('phone');
    const ministryId = formData.get('ministryId');
    const modules = formData.get('modules');
    const isActive = formData.get('isActive') !== 'false'; // Par défaut true
    const photo = formData.get('photo');

    // Validation
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email et nom sont requis' },
        { status: 400 }
      );
    }

    // Extraire firstName et lastName du name complet
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || 'Utilisateur';
    const lastName = nameParts.slice(1).join(' ') || 'Nouveau';

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Valider le rôle
    const normalizedRole = (role || 'agent').toLowerCase();
    const validRole = VALID_ROLES.includes(normalizedRole) ? normalizedRole : 'agent';

    // Hacher le mot de passe
    let hashedPassword = null;
    const passwordToHash = password || 'Temporaire123!';
    hashedPassword = await bcrypt.hash(passwordToHash, 10);

    // Gérer l'upload de la photo
    let imagePath = null;
    if (photo && photo.size > 0) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), 'public', 'images', 'utilisateurs');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${photo.name.split('.').pop()}`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, buffer);
      imagePath = `/images/utilisateurs/${fileName}`;
    }

    // Créer l'utilisateur
    const user = await User.create({
      id: generateUUID(),
      firstName,
      lastName,
      name, // Garder aussi le nom complet pour compatibilité
      email,
      password: hashedPassword,
      role: validRole,
      department: department || null,
      phone: phone || null,
      ministryId: ministryId || null,
      modules: parseModules(modules),
      isActive,
      image: imagePath,
    });

    // Récupérer l'utilisateur avec son ministère
    const newUser = await User.findByPk(user.id, {
      attributes: ['id', 'email', 'name', 'role', 'isActive', 'image', 'phone', 'department', 'ministryId', 'modules', 'created_at'],
      include: [
        {
          model: Ministry,
          as: 'ministry',
          attributes: ['id', 'name', 'shortName', 'code'],
          required: false,
        },
      ],
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}
