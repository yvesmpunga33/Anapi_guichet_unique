import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { User, Ministry } from '../../../../models/index.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// GET /api/users/[id] - Récupérer un utilisateur
export async function GET(request, { params }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'email', 'name', 'role', 'isActive', 'image', 'phone', 'department', 'ministryId', 'modules', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Ministry,
          as: 'ministry',
          attributes: ['id', 'name', 'shortName', 'code'],
          required: false,
        },
      ],
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Mettre à jour un utilisateur
export async function PUT(request, { params }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier le rôle admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const user = await User.findByPk(id);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');
    const department = formData.get('department');
    const phone = formData.get('phone');
    const ministryId = formData.get('ministryId');
    const modules = formData.get('modules');
    const isActive = formData.get('isActive');
    const photo = formData.get('photo');

    // Vérifier si l'email existe déjà pour un autre utilisateur
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Préparer les données de mise à jour
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (department !== undefined) updateData.department = department || null;
    if (phone !== undefined) updateData.phone = phone || null;
    if (ministryId !== undefined) updateData.ministryId = ministryId || null;
    if (modules) updateData.modules = JSON.parse(modules);
    if (isActive !== null && isActive !== undefined) {
      updateData.isActive = isActive === 'true';
    }

    // Hacher le nouveau mot de passe si fourni
    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Gérer l'upload de la nouvelle photo
    if (photo && photo.size > 0) {
      // Supprimer l'ancienne photo si elle existe
      if (user.image) {
        const oldImagePath = path.join(process.cwd(), 'public', user.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), 'public', 'images', 'utilisateurs');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${photo.name.split('.').pop()}`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, buffer);
      updateData.image = `/images/utilisateurs/${fileName}`;
    }

    // Mettre à jour l'utilisateur
    await user.update(updateData);

    // Récupérer l'utilisateur mis à jour avec son ministère
    const updatedUser = await User.findByPk(id, {
      attributes: ['id', 'email', 'name', 'role', 'isActive', 'image', 'phone', 'department', 'ministryId', 'modules', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Ministry,
          as: 'ministry',
          attributes: ['id', 'name', 'shortName', 'code'],
          required: false,
        },
      ],
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Supprimer un utilisateur
export async function DELETE(request, { params }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier le rôle admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Empêcher l'auto-suppression
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      );
    }

    const user = await User.findByPk(id);
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer la photo si elle existe
    if (user.image) {
      const imagePath = path.join(process.cwd(), 'public', user.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Supprimer l'utilisateur
    await user.destroy();

    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    );
  }
}
