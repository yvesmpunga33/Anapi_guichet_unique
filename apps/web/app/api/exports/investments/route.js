import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { Investment, Investor, ProjectMilestone, ProjectRisk, ProjectImpact, sequelize } from '../../../../models/index.js';
import * as XLSX from 'xlsx';

// Helper function to export projects
async function exportProjects(whereClause) {
  const projects = await Investment.findAll({
    where: whereClause,
    include: [{ model: Investor, as: 'investor', attributes: ['name', 'country', 'type'] }],
    order: [['createdAt', 'DESC']],
  });

  return {
    data: projects.map(p => ({
      'Code Projet': p.projectCode || '',
      'Nom du Projet': p.projectName || '',
      'Investisseur': p.investor?.name || '',
      'Pays Investisseur': p.investor?.country || '',
      'Type Investisseur': p.investor?.type || '',
      'Secteur': p.sector || '',
      'Province': p.province || '',
      'Montant (USD)': p.amount ? parseFloat(p.amount) : 0,
      'Devises': p.currency || 'USD',
      'Emplois Directs Prévus': p.jobsCreated || 0,
      'Emplois Indirects Prévus': p.jobsIndirect || 0,
      'Progression (%)': p.progress || 0,
      'Statut': p.status || '',
      'Date Création': p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '',
      'Date Début': p.startDate ? new Date(p.startDate).toLocaleDateString('fr-FR') : '',
      'Date Fin Prévue': p.endDate ? new Date(p.endDate).toLocaleDateString('fr-FR') : '',
      'Description': p.description || '',
    })),
    filename: `projets_investissements_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'Projets',
  };
}

// Helper function to export impacts
async function exportImpacts(whereClause) {
  const includeOptions = Object.keys(whereClause).length > 0 ? {
    model: Investment,
    as: 'project',
    attributes: ['projectCode', 'projectName', 'sector', 'province'],
    where: whereClause,
  } : {
    model: Investment,
    as: 'project',
    attributes: ['projectCode', 'projectName', 'sector', 'province'],
  };

  const impacts = await ProjectImpact.findAll({
    include: [includeOptions],
    order: [['reportDate', 'DESC']],
  });

  return {
    data: impacts.map(i => ({
      'Code Projet': i.project?.projectCode || '',
      'Nom du Projet': i.project?.projectName || '',
      'Secteur': i.project?.sector || '',
      'Province': i.project?.province || '',
      'Date Rapport': i.reportDate ? new Date(i.reportDate).toLocaleDateString('fr-FR') : '',
      'Période': i.reportPeriod || '',
      'Emplois Directs Créés': i.directJobsCreated || 0,
      'Emplois Indirects Créés': i.indirectJobsCreated || 0,
      'Emplois Permanents': i.permanentJobs || 0,
      'Emplois Temporaires': i.temporaryJobs || 0,
      'Emplois Féminins': i.femaleJobs || 0,
      'Emplois Jeunes': i.youthJobs || 0,
      'Emplois Locaux': i.localJobs || 0,
      'Revenus Générés (USD)': i.actualRevenue ? parseFloat(i.actualRevenue) : 0,
      'Taxes Payées (USD)': i.taxesPaid ? parseFloat(i.taxesPaid) : 0,
      'Exportations (USD)': i.exportRevenue ? parseFloat(i.exportRevenue) : 0,
      'Achats Locaux (USD)': i.localPurchases ? parseFloat(i.localPurchases) : 0,
      'Invest. Communautaires (USD)': i.communityInvestment ? parseFloat(i.communityInvestment) : 0,
      'Employés Formés': i.trainedEmployees || 0,
      'Heures Formation': i.trainingHours || 0,
      'Bénéficiaires': i.beneficiaries || 0,
    })),
    filename: `impacts_investissements_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'Impacts',
  };
}

// Helper function to export risks
async function exportRisks(whereClause) {
  const includeOptions = Object.keys(whereClause).length > 0 ? {
    model: Investment,
    as: 'project',
    attributes: ['projectCode', 'projectName', 'sector', 'province'],
    where: whereClause,
  } : {
    model: Investment,
    as: 'project',
    attributes: ['projectCode', 'projectName', 'sector', 'province'],
  };

  const risks = await ProjectRisk.findAll({
    include: [includeOptions],
    order: [['riskScore', 'DESC']],
  });

  return {
    data: risks.map(r => ({
      'Code Projet': r.project?.projectCode || '',
      'Nom du Projet': r.project?.projectName || '',
      'Secteur': r.project?.sector || '',
      'Titre Risque': r.title || '',
      'Catégorie': r.category || '',
      'Probabilité': r.probability || '',
      'Impact': r.impact || '',
      'Score': r.riskScore || 0,
      'Niveau': r.riskLevel || '',
      'Statut': r.status || '',
      'Stratégie Mitigation': r.mitigationStrategy || '',
      'Coût Estimé Impact': r.estimatedCost ? parseFloat(r.estimatedCost) : 0,
      'Coût Mitigation': r.mitigationCost ? parseFloat(r.mitigationCost) : 0,
      'Responsable': r.ownerName || '',
      'Date Identification': r.identifiedDate ? new Date(r.identifiedDate).toLocaleDateString('fr-FR') : '',
      'Prochaine Revue': r.nextReviewDate ? new Date(r.nextReviewDate).toLocaleDateString('fr-FR') : '',
    })),
    filename: `risques_projets_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'Risques',
  };
}

// Helper function to export milestones
async function exportMilestones(whereClause) {
  const includeOptions = Object.keys(whereClause).length > 0 ? {
    model: Investment,
    as: 'project',
    attributes: ['projectCode', 'projectName', 'sector', 'province'],
    where: whereClause,
  } : {
    model: Investment,
    as: 'project',
    attributes: ['projectCode', 'projectName', 'sector', 'province'],
  };

  const milestones = await ProjectMilestone.findAll({
    include: [includeOptions],
    order: [['plannedEndDate', 'ASC']],
  });

  return {
    data: milestones.map(m => ({
      'Code Projet': m.project?.projectCode || '',
      'Nom du Projet': m.project?.projectName || '',
      'Secteur': m.project?.sector || '',
      'Nom Jalon': m.name || '',
      'Description': m.description || '',
      'Catégorie': m.category || '',
      'Date Début Prévue': m.plannedStartDate ? new Date(m.plannedStartDate).toLocaleDateString('fr-FR') : '',
      'Date Fin Prévue': m.plannedEndDate ? new Date(m.plannedEndDate).toLocaleDateString('fr-FR') : '',
      'Date Début Réelle': m.actualStartDate ? new Date(m.actualStartDate).toLocaleDateString('fr-FR') : '',
      'Date Fin Réelle': m.actualEndDate ? new Date(m.actualEndDate).toLocaleDateString('fr-FR') : '',
      'Statut': m.status || '',
      'Priorité': m.priority || '',
      'Progression (%)': m.progress || 0,
      'Budget Prévu': m.budget ? parseFloat(m.budget) : 0,
      'Coût Réel': m.actualCost ? parseFloat(m.actualCost) : 0,
      'Responsable': m.responsibleName || '',
    })),
    filename: `jalons_projets_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'Jalons',
  };
}

// Helper function to export summary
async function exportSummary() {
  const [projectStats, impactStats] = await Promise.all([
    Investment.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('SUM', sequelize.col('jobsCreated')), 'totalJobs'],
      ],
      group: ['status'],
      raw: true,
    }),
    ProjectImpact.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('direct_jobs_created')), 'totalDirectJobs'],
        [sequelize.fn('SUM', sequelize.col('indirect_jobs_created')), 'totalIndirectJobs'],
        [sequelize.fn('SUM', sequelize.col('actual_revenue')), 'totalRevenue'],
        [sequelize.fn('SUM', sequelize.col('taxes_paid')), 'totalTaxes'],
        [sequelize.fn('SUM', sequelize.col('export_revenue')), 'totalExports'],
      ],
      raw: true,
    }),
  ]);

  // First sheet: Project stats by status
  const sheet1Data = projectStats.map(s => ({
    'Statut': s.status,
    'Nombre de Projets': parseInt(s.count) || 0,
    'Montant Total (USD)': parseFloat(s.totalAmount) || 0,
    'Emplois Prévus': parseInt(s.totalJobs) || 0,
  }));

  // Second sheet: Impact summary
  const sheet2Data = [
    { 'Indicateur': 'Emplois Directs Créés', 'Valeur': parseInt(impactStats?.totalDirectJobs) || 0 },
    { 'Indicateur': 'Emplois Indirects Créés', 'Valeur': parseInt(impactStats?.totalIndirectJobs) || 0 },
    { 'Indicateur': 'Revenus Générés (USD)', 'Valeur': parseFloat(impactStats?.totalRevenue) || 0 },
    { 'Indicateur': 'Taxes Payées (USD)', 'Valeur': parseFloat(impactStats?.totalTaxes) || 0 },
    { 'Indicateur': 'Exportations (USD)', 'Valeur': parseFloat(impactStats?.totalExports) || 0 },
  ];

  // Create multi-sheet workbook
  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(sheet1Data);
  const ws2 = XLSX.utils.json_to_sheet(sheet2Data);
  XLSX.utils.book_append_sheet(wb, ws1, 'Projets par Statut');
  XLSX.utils.book_append_sheet(wb, ws2, 'Impacts Consolidés');

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

  return {
    buffer,
    filename: `rapport_synthese_${new Date().toISOString().split('T')[0]}.xlsx`,
    isMultiSheet: true,
  };
}

// GET /api/exports/investments - Export investment data
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'projects';
    const format = searchParams.get('format') || 'xlsx';
    const status = searchParams.get('status');
    const sector = searchParams.get('sector');
    const province = searchParams.get('province');

    const whereClause = {};
    if (status) whereClause.status = status;
    if (sector) whereClause.sector = sector;
    if (province) whereClause.province = province;

    let result;

    if (type === 'projects') {
      result = await exportProjects(whereClause);
    } else if (type === 'impacts') {
      result = await exportImpacts(whereClause);
    } else if (type === 'risks') {
      result = await exportRisks(whereClause);
    } else if (type === 'milestones') {
      result = await exportMilestones(whereClause);
    } else if (type === 'summary') {
      result = await exportSummary();
      // Summary already returns a buffer
      return new NextResponse(result.buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${result.filename}"`,
        },
      });
    } else {
      return NextResponse.json({ error: 'Type d\'export non valide' }, { status: 400 });
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(result.data);

    // Auto-size columns
    if (result.data.length > 0) {
      const colWidths = Object.keys(result.data[0]).map(key => ({
        wch: Math.min(50, Math.max(key.length, ...result.data.map(row => String(row[key] || '').length)) + 2)
      }));
      ws['!cols'] = colWidths;
    }

    XLSX.utils.book_append_sheet(wb, ws, result.sheetName);

    if (format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(ws);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${result.filename}.csv"`,
        },
      });
    }

    // Default to XLSX
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${result.filename}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'export', details: error.message },
      { status: 500 }
    );
  }
}
