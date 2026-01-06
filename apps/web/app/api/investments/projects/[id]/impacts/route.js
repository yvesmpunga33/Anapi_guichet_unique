import { NextResponse } from 'next/server';
import { auth } from '../../../../../lib/auth.js';
import { ProjectImpact, Investment, User } from '../../../../../../models/index.js';

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
      // Emplois (support both naming conventions)
      directJobsPlanned: body.directJobsPlanned || project.jobsCreated || 0,
      directJobsCreated: body.directJobsCreated || body.directJobs || 0,
      indirectJobsPlanned: body.indirectJobsPlanned || project.jobsIndirect || 0,
      indirectJobsCreated: body.indirectJobsCreated || body.indirectJobs || 0,
      permanentJobs: body.permanentJobs || 0,
      temporaryJobs: body.temporaryJobs || 0,
      localJobs: body.localJobs || 0,
      femaleJobs: body.femaleJobs || 0,
      youthJobs: body.youthJobs || 0,
      // Revenus (support both naming conventions)
      projectedRevenue: body.projectedRevenue || 0,
      actualRevenue: body.actualRevenue || body.localRevenue || 0,
      taxesPaid: body.taxesPaid || body.taxContribution || 0,
      localPurchases: body.localPurchases || 0,
      exportRevenue: body.exportRevenue || body.exportValue || 0,
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

// PUT - Mettre à jour un rapport d'impact
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const impactId = searchParams.get('id');
    const body = await request.json();

    if (!impactId) {
      return NextResponse.json({ error: 'ID du rapport requis' }, { status: 400 });
    }

    const impact = await ProjectImpact.findOne({
      where: { id: impactId, projectId: id },
    });

    if (!impact) {
      return NextResponse.json({ error: 'Rapport non trouvé' }, { status: 404 });
    }

    await impact.update({
      reportDate: body.reportDate || impact.reportDate,
      directJobsCreated: body.directJobsCreated || body.directJobs || impact.directJobsCreated,
      indirectJobsCreated: body.indirectJobsCreated || body.indirectJobs || impact.indirectJobsCreated,
      actualRevenue: body.actualRevenue || body.localRevenue || impact.actualRevenue,
      taxesPaid: body.taxesPaid || body.taxContribution || impact.taxesPaid,
      exportRevenue: body.exportRevenue || body.exportValue || impact.exportRevenue,
      localPurchases: body.localPurchases || impact.localPurchases,
      trainingHours: body.trainingHours || impact.trainingHours,
      notes: body.notes !== undefined ? body.notes : impact.notes,
    });

    return NextResponse.json({
      success: true,
      data: impact,
      message: 'Rapport mis à jour avec succès',
    });
  } catch (error) {
    console.error('Error updating impact:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un rapport d'impact
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const impactId = searchParams.get('id');

    if (!impactId) {
      return NextResponse.json({ error: 'ID du rapport requis' }, { status: 400 });
    }

    const impact = await ProjectImpact.findOne({
      where: { id: impactId, projectId: id },
    });

    if (!impact) {
      return NextResponse.json({ error: 'Rapport non trouvé' }, { status: 404 });
    }

    await impact.destroy();

    return NextResponse.json({
      success: true,
      message: 'Rapport supprimé avec succès',
    });
  } catch (error) {
    console.error('Error deleting impact:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression', details: error.message },
      { status: 500 }
    );
  }
}
