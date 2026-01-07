import { NextResponse } from 'next/server';
import { auth } from '../app/lib/auth.js';
import Investment from '../models/Investment.js';
import Investor from '../models/Investor.js';
import ProjectHistory from '../models/ProjectHistory.js';
import { Op } from 'sequelize';

/**
 * Service pour la gestion des projets d'investissement
 * Contient toute la logique métier séparée des routes
 */

// GET - Liste des projets d'investissement
export async function getProjects(request) {
  try {
    const session = await auth();
    console.log('[InvestmentService] getProjects - Session:', session ? 'authenticated' : 'null');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const sector = searchParams.get('sector');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    if (search) {
      where[Op.or] = [
        { projectName: { [Op.iLike]: `%${search}%` } },
        { projectCode: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (sector && sector !== 'all') {
      where.sector = sector;
    }

    const { count, rows: projects } = await Investment.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // Get investors for the projects
    const investorIds = [...new Set(projects.map(p => p.investorId).filter(Boolean))];
    const investors = investorIds.length > 0
      ? await Investor.findAll({ where: { id: investorIds } })
      : [];

    const investorMap = {};
    investors.forEach(inv => {
      investorMap[inv.id] = inv.toJSON();
    });

    // Add investor info to each project
    const projectsWithInvestor = projects.map(project => {
      const proj = project.toJSON();
      return {
        ...proj,
        investor: proj.investorId ? investorMap[proj.investorId] : null,
      };
    });

    // Calculate stats
    const allProjects = await Investment.findAll();
    const stats = {
      total: allProjects.length,
      inProgress: allProjects.filter(p => p.status === 'IN_PROGRESS').length,
      totalAmount: allProjects.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
      totalJobs: allProjects.reduce((sum, p) => sum + (p.jobsCreated || 0), 0),
    };

    // Get unique sectors for filter
    const sectors = [...new Set(allProjects.map(p => p.sector).filter(Boolean))];

    return NextResponse.json({
      projects: projectsWithInvestor,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
      stats,
      sectors,
    });
  } catch (error) {
    console.error('[InvestmentService] Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des projets' },
      { status: 500 }
    );
  }
}

// POST - Creer un projet d'investissement
export async function createProject(request) {
  try {
    const session = await auth();
    console.log('[InvestmentService] createProject - Session:', session ? 'authenticated' : 'null');

    const body = await request.json();

    // Generate project code
    const projectCode = await generateProjectCode();

    const project = await Investment.create({
      ...body,
      projectCode,
      createdById: session?.user?.id || null,
    });

    // Enregistrer la creation dans l'historique
    await logProjectHistory({
      projectId: project.id,
      action: 'CREATED',
      newStatus: project.status || 'DRAFT',
      description: `Projet "${project.projectName}" cree avec le code ${projectCode}`,
      performedById: session?.user?.id || null,
      performedByName: session?.user?.name || 'Systeme',
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('[InvestmentService] Error creating project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la creation du projet' },
      { status: 500 }
    );
  }
}

// GET - Obtenir un projet par ID
export async function getProjectById(projectId) {
  try {
    const project = await Investment.findByPk(projectId);

    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouve' },
        { status: 404 }
      );
    }

    // Get investor info
    let investor = null;
    if (project.investorId) {
      investor = await Investor.findByPk(project.investorId);
    }

    return NextResponse.json({
      ...project.toJSON(),
      investor: investor ? investor.toJSON() : null,
    });
  } catch (error) {
    console.error('[InvestmentService] Error fetching project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du projet' },
      { status: 500 }
    );
  }
}

// PUT - Mettre a jour un projet
export async function updateProject(projectId, request) {
  try {
    const session = await auth();
    const body = await request.json();

    const project = await Investment.findByPk(projectId);

    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouve' },
        { status: 404 }
      );
    }

    const oldStatus = project.status;
    await project.update(body);

    // Log status change if applicable
    if (body.status && body.status !== oldStatus) {
      await logProjectHistory({
        projectId: project.id,
        action: 'STATUS_CHANGED',
        previousStatus: oldStatus,
        newStatus: body.status,
        description: `Statut modifie de "${oldStatus}" a "${body.status}"`,
        performedById: session?.user?.id || null,
        performedByName: session?.user?.name || 'Systeme',
      });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('[InvestmentService] Error updating project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour du projet' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un projet
export async function deleteProject(projectId) {
  try {
    const project = await Investment.findByPk(projectId);

    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouve' },
        { status: 404 }
      );
    }

    await project.destroy();

    return NextResponse.json({ message: 'Projet supprime avec succes' });
  } catch (error) {
    console.error('[InvestmentService] Error deleting project:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du projet' },
      { status: 500 }
    );
  }
}

// Helper: Generate project code
async function generateProjectCode() {
  const lastProject = await Investment.findOne({
    order: [['createdAt', 'DESC']],
  });

  let nextNumber = 1;
  if (lastProject && lastProject.projectCode) {
    const match = lastProject.projectCode.match(/PRJ-\d{4}-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  const year = new Date().getFullYear();
  return `PRJ-${year}-${String(nextNumber).padStart(5, '0')}`;
}

// Helper: Log project history
async function logProjectHistory(data) {
  try {
    await ProjectHistory.create(data);
  } catch (error) {
    console.error('[InvestmentService] Error logging project history:', error);
  }
}
