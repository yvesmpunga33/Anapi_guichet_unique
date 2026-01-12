import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { User } from '../../../../models/index.js';
import { getClientIP, checkRateLimit } from '../../../lib/rate-limit.js';

export async function POST(request) {
  try {
    // Rate limiting pour l'inscription
    const ip = getClientIP(request);
    const rateLimitResult = checkRateLimit(ip, 'register');

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Trop de tentatives d\'inscription',
          message: `Limite atteinte. Réessayez dans ${Math.ceil(rateLimitResult.retryAfter / 60)} minutes.`,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter),
          },
        }
      );
    }

    const body = await request.json();
    const { email, password, name } = body;

    // Validation de l'email
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation de la force du mot de passe
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Vérification de complexité du mot de passe
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return NextResponse.json(
        {
          error:
            'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
        },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || email.split('@')[0],
      role: 'USER',
      isActive: true,
    });

    // Log de l'inscription (sans données sensibles)
    console.log(
      `[REGISTER] Nouvel utilisateur créé: ${user.id} depuis IP: ${ip}`
    );

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        },
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
