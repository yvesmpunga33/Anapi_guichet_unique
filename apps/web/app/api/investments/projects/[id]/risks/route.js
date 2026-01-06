import { NextResponse } from 'next/server';
import { auth } from '../../../../../lib/auth.js';
import { ProjectRisk, Investment, User } from '../../../../../../models/index.js';

// GET - Liste des risques d'un projet
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const riskLevel = searchParams.get('riskLevel');

    // Vérifier que le projet existe
    const project = await Investment.findByPk(id);
    if (!project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    const where = { projectId: id };
    if (status) where.status = status;
    if (riskLevel) where.riskLevel = riskLevel;

    const risks = await ProjectRisk.findAll({
      where,
      include: [
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
        { model: User, as: 'updatedBy', attributes: ['id', 'name'] },
      ],
      order: [['riskScore', 'DESC'], ['createdAt', 'DESC']],
    });

    // Statistiques
    const stats = {
      total: risks.length,
      critical: risks.filter(r => r.riskLevel === 'CRITICAL').length,
      high: risks.filter(r => r.riskLevel === 'HIGH').length,
      moderate: risks.filter(r => r.riskLevel === 'MODERATE').length,
      low: risks.filter(r => r.riskLevel === 'LOW').length,
      resolved: risks.filter(r => r.status === 'RESOLVED').length,
      byCategory: {},
    };

    // Grouper par catégorie
    risks.forEach(r => {
      if (!stats.byCategory[r.category]) {
        stats.byCategory[r.category] = 0;
      }
      stats.byCategory[r.category]++;
    });

    return NextResponse.json({
      success: true,
      data: risks,
      stats,
    });
  } catch (error) {
    console.error('Error fetching risks:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des risques', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer un risque
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
    if (!body.title) {
      return NextResponse.json(
        { error: 'Le titre du risque est obligatoire' },
        { status: 400 }
      );
    }

    // Générer un code de risque
    const count = await ProjectRisk.count({ where: { projectId: id } });
    const code = `R-${project.projectCode || id.substring(0, 8)}-${(count + 1).toString().padStart(3, '0')}`;

    const risk = await ProjectRisk.create({
      projectId: id,
      code,
      title: body.title,
      description: body.description,
      category: body.category || 'OTHER',
      probability: body.probability || 'MEDIUM',
      impact: body.impact || 'MEDIUM',
      mitigationStrategy: body.mitigationStrategy,
      mitigationActions: body.mitigationActions || [],
      contingencyPlan: body.contingencyPlan,
      estimatedCost: body.estimatedCost,
      mitigationCost: body.mitigationCost,
      currency: body.currency || 'USD',
      ownerName: body.ownerName,
      ownerContact: body.ownerContact,
      triggers: body.triggers || [],
      nextReviewDate: body.nextReviewDate,
      notes: body.notes,
      createdById: session.user.id,
    });

    return NextResponse.json({
      success: true,
      data: risk,
      message: 'Risque créé avec succès',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating risk:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du risque', details: error.message },
      { status: 500 }
    );
  }
}
