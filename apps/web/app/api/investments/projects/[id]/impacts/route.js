import { NextResponse } from 'next/server';
import { auth } from '../../../../../lib/auth.js';
import { ProjectImpact, Investment, User, sequelize } from '../../../../../../models/index.js';
import { Op } from 'sequelize';

// GET - Liste des rapports d'impact d'un projet
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

    const impacts = await ProjectImpact.findAll({
      where: { projectId: id },
      include: [
        { model: User, as: 'verifiedBy', attributes: ['id', 'name'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name'] },
      ],
      order: [['reportDate', 'DESC']],
    });

    // Calculer les totaux cumulés (dernier rapport)
    const latestImpact = impacts[0];
    const summary = latestImpact ? {
      totalDirectJobs: latestImpact.directJobsCreated,
      totalIndirectJobs: latestImpact.indirectJobsCreated,
      totalRevenue: latestImpact.actualRevenue,
      totalTaxesPaid: latestImpact.taxesPaid,
      totalTrainedEmployees: latestImpact.trainedEmployees,
      totalCommunityInvestment: latestImpact.communityInvestment,
      currency: latestImpact.currency,
    } : null;

    return NextResponse.json({
      success: true,
      data: impacts,
      summary,
    });
  } catch (error) {
    console.error('Error fetching impacts:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des impacts', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer un rapport d'impact
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

    const impact = await ProjectImpact.create({
      projectId: id,
      reportDate: body.reportDate || new Date(),
      reportPeriod: body.reportPeriod,
      // Emplois
      directJobsPlanned: body.directJobsPlanned || project.jobsCreated || 0,
      directJobsCreated: body.directJobsCreated || 0,
      indirectJobsPlanned: body.indirectJobsPlanned || project.jobsIndirect || 0,
      indirectJobsCreated: body.indirectJobsCreated || 0,
      permanentJobs: body.permanentJobs || 0,
      temporaryJobs: body.temporaryJobs || 0,
      localJobs: body.localJobs || 0,
      femaleJobs: body.femaleJobs || 0,
      youthJobs: body.youthJobs || 0,
      // Revenus
      projectedRevenue: body.projectedRevenue || 0,
      actualRevenue: body.actualRevenue || 0,
      taxesPaid: body.taxesPaid || 0,
      localPurchases: body.localPurchases || 0,
      exportRevenue: body.exportRevenue || 0,
      currency: body.currency || project.currency || 'USD',
      // Formation
      trainedEmployees: body.trainedEmployees || 0,
      trainingHours: body.trainingHours || 0,
      trainingInvestment: body.trainingInvestment || 0,
      // Impact social
      communityInvestment: body.communityInvestment || 0,
      infrastructureBuilt: body.infrastructureBuilt || [],
      beneficiaries: body.beneficiaries || 0,
      // Impact environnemental
      carbonFootprint: body.carbonFootprint,
      renewableEnergyPercent: body.renewableEnergyPercent,
      wasteRecycledPercent: body.wasteRecycledPercent,
      waterUsage: body.waterUsage,
      environmentalMeasures: body.environmentalMeasures || [],
      // Transfert de technologie
      technologyTransfers: body.technologyTransfers || [],
      patentsRegistered: body.patentsRegistered || 0,
      localPartnerships: body.localPartnerships || 0,
      // Notes
      achievements: body.achievements,
      challenges: body.challenges,
      nextSteps: body.nextSteps,
      notes: body.notes,
      createdById: session.user.id,
    });

    // Mettre à jour les emplois sur le projet principal
    if (body.directJobsCreated) {
      await project.update({ jobsCreated: body.directJobsCreated });
    }
    if (body.indirectJobsCreated) {
      await project.update({ jobsIndirect: body.indirectJobsCreated });
    }

    return NextResponse.json({
      success: true,
      data: impact,
      message: 'Rapport d\'impact créé avec succès',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating impact:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du rapport d\'impact', details: error.message },
      { status: 500 }
    );
  }
}
