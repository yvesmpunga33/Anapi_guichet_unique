import { NextResponse } from 'next/server';
import { auth } from '../../../../../lib/auth.js';
import { ProjectMilestone, Investment, User, sequelize } from '../../../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des jalons d'un projet
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    // Vérifier que le projet existe
    const project = await Investment.findByPk(id);
    if (!project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    const milestones = await ProjectMilestone.findAll({
      where: { projectId: id },
      include: [
        { model: User, as: 'completedBy', attributes: ['id', 'name'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
      ],
      order: [['order', 'ASC'], ['plannedEndDate', 'ASC']],
    });

    // Calculer les statistiques
    const stats = {
      total: milestones.length,
      completed: milestones.filter(m => m.status === 'COMPLETED').length,
      inProgress: milestones.filter(m => m.status === 'IN_PROGRESS').length,
      delayed: milestones.filter(m => m.status === 'DELAYED').length,
      notStarted: milestones.filter(m => m.status === 'NOT_STARTED').length,
      overallProgress: 0,
    };

    // Calculer la progression globale pondérée
    if (milestones.length > 0) {
      let totalWeight = 0;
      let weightedProgress = 0;

      milestones.forEach(m => {
        const weight = parseFloat(m.weight) || (100 / milestones.length);
        totalWeight += weight;
        weightedProgress += (parseFloat(m.progress) || 0) * weight;
      });

      if (totalWeight > 0) {
        stats.overallProgress = Math.round(weightedProgress / totalWeight);
      }
    }

    return NextResponse.json({
      success: true,
      data: milestones,
      stats,
    });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des jalons', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer un jalon
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Vérifier que le projet existe
    const project = await Investment.findByPk(id);
    if (!project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    // Validation
    if (!body.name) {
      return NextResponse.json(
        { error: 'Le nom du jalon est obligatoire' },
        { status: 400 }
      );
    }

    // Déterminer l'ordre
    const lastMilestone = await ProjectMilestone.findOne({
      where: { projectId: id },
      order: [['order', 'DESC']],
    });
    const order = lastMilestone ? lastMilestone.order + 1 : 1;

    const milestone = await ProjectMilestone.create({
      projectId: id,
      name: body.name,
      description: body.description,
      category: body.category || 'OTHER',
      plannedStartDate: body.plannedStartDate,
      plannedEndDate: body.plannedEndDate,
      status: body.status || 'NOT_STARTED',
      progress: body.progress || 0,
      priority: body.priority || 'MEDIUM',
      budget: body.budget,
      actualCost: body.actualCost,
      currency: body.currency || 'USD',
      weight: body.weight,
      deliverables: body.deliverables || [],
      dependencies: body.dependencies || [],
      responsibleName: body.responsibleName,
      responsibleContact: body.responsibleContact,
      notes: body.notes,
      order,
      createdById: session.user.id,
    });

    return NextResponse.json({
      success: true,
      data: milestone,
      message: 'Jalon créé avec succès',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating milestone:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du jalon', details: error.message },
      { status: 500 }
    );
  }
}
