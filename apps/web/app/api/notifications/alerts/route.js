import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import {
  Contract,
  ProjectMilestone,
  ProjectRisk,
  ApprovalRequest,
  Tender,
  Investment,
  Investor,
  ProcurementContract,
  LegalAlert,
  sequelize
} from '../../../../models/index.js';
import { Op } from 'sequelize';

// GET /api/notifications/alerts - Get all system alerts
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // all, investments, procurement, legal
    const priority = searchParams.get('priority'); // all, critical, high, medium, low
    const limit = parseInt(searchParams.get('limit')) || 20;

    const today = new Date();
    const sevenDays = new Date(today);
    sevenDays.setDate(today.getDate() + 7);
    const thirtyDays = new Date(today);
    thirtyDays.setDate(today.getDate() + 30);

    const alerts = [];

    // 1. Delayed milestones (investment projects)
    if (!category || category === 'all' || category === 'investments') {
      const delayedMilestones = await ProjectMilestone.findAll({
        where: {
          status: { [Op.notIn]: ['COMPLETED', 'CANCELLED'] },
          plannedEndDate: { [Op.lt]: today }
        },
        include: [{
          model: Investment,
          as: 'project',
          attributes: ['id', 'projectName', 'projectCode'],
        }],
        order: [['plannedEndDate', 'ASC']],
        limit: 10,
      });

      delayedMilestones.forEach(m => {
        const daysLate = Math.ceil((today - new Date(m.plannedEndDate)) / (1000 * 60 * 60 * 24));
        alerts.push({
          id: `milestone-${m.id}`,
          type: 'MILESTONE_DELAYED',
          category: 'investments',
          priority: daysLate > 30 ? 'CRITICAL' : daysLate > 14 ? 'HIGH' : 'MEDIUM',
          title: `Jalon en retard: ${m.name}`,
          description: `Ce jalon est en retard de ${daysLate} jour(s). Progression actuelle: ${m.progress}%`,
          projectId: m.project?.id,
          projectName: m.project?.projectName,
          projectCode: m.project?.projectCode,
          link: `/investments/projects/${m.project?.id}`,
          dueDate: m.plannedEndDate,
          daysLate,
          createdAt: m.updatedAt,
        });
      });

      // Critical risks
      const criticalRisks = await ProjectRisk.findAll({
        where: {
          riskLevel: { [Op.in]: ['HIGH', 'CRITICAL'] },
          status: { [Op.notIn]: ['RESOLVED', 'ACCEPTED'] }
        },
        include: [{
          model: Investment,
          as: 'project',
          attributes: ['id', 'projectName', 'projectCode'],
        }],
        order: [['riskScore', 'DESC']],
        limit: 10,
      });

      criticalRisks.forEach(r => {
        alerts.push({
          id: `risk-${r.id}`,
          type: 'RISK_CRITICAL',
          category: 'investments',
          priority: r.riskLevel,
          title: `Risque ${r.riskLevel === 'CRITICAL' ? 'critique' : 'élevé'}: ${r.title}`,
          description: r.description || `Score de risque: ${r.riskScore}/25`,
          projectId: r.project?.id,
          projectName: r.project?.projectName,
          projectCode: r.project?.projectCode,
          link: `/investments/projects/${r.project?.id}`,
          riskCategory: r.category,
          riskScore: r.riskScore,
          createdAt: r.updatedAt,
        });
      });

      // Pending approval requests
      const pendingApprovals = await ApprovalRequest.findAll({
        where: {
          status: { [Op.in]: ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_DOCUMENTS'] }
        },
        include: [
          { model: Investment, as: 'investment', attributes: ['id', 'projectName', 'projectCode'] },
          { model: Investor, as: 'investor', attributes: ['id', 'name'] },
        ],
        order: [['createdAt', 'ASC']],
        limit: 10,
      });

      pendingApprovals.forEach(a => {
        const daysPending = Math.ceil((today - new Date(a.createdAt)) / (1000 * 60 * 60 * 24));
        alerts.push({
          id: `approval-${a.id}`,
          type: 'APPROVAL_PENDING',
          category: 'investments',
          priority: daysPending > 30 ? 'HIGH' : daysPending > 14 ? 'MEDIUM' : 'LOW',
          title: `Demande d'approbation en attente`,
          description: `${a.requestType || 'Demande'} de ${a.investor?.name || 'Investisseur'} - En attente depuis ${daysPending} jour(s)`,
          projectId: a.investment?.id,
          projectName: a.investment?.projectName,
          projectCode: a.investment?.projectCode,
          link: `/investments/approvals/${a.id}`,
          daysPending,
          createdAt: a.createdAt,
        });
      });
    }

    // 2. Procurement alerts
    if (!category || category === 'all' || category === 'procurement') {
      // Tenders with upcoming deadlines
      const upcomingTenders = await Tender.findAll({
        where: {
          status: 'PUBLISHED',
          submissionDeadline: {
            [Op.between]: [today, sevenDays]
          }
        },
        order: [['submissionDeadline', 'ASC']],
        limit: 10,
      });

      upcomingTenders.forEach(t => {
        const daysRemaining = Math.ceil((new Date(t.submissionDeadline) - today) / (1000 * 60 * 60 * 24));
        alerts.push({
          id: `tender-deadline-${t.id}`,
          type: 'TENDER_DEADLINE',
          category: 'procurement',
          priority: daysRemaining <= 2 ? 'CRITICAL' : daysRemaining <= 5 ? 'HIGH' : 'MEDIUM',
          title: `Date limite d'appel d'offres proche`,
          description: `${t.title} - Date limite dans ${daysRemaining} jour(s)`,
          reference: t.reference,
          link: `/procurement/tenders/${t.id}`,
          dueDate: t.submissionDeadline,
          daysRemaining,
          createdAt: t.updatedAt,
        });
      });

      // Contracts expiring soon
      const expiringProcurementContracts = await ProcurementContract.findAll({
        where: {
          status: 'ACTIVE',
          endDate: {
            [Op.between]: [today, thirtyDays]
          }
        },
        order: [['endDate', 'ASC']],
        limit: 10,
      });

      expiringProcurementContracts.forEach(c => {
        const daysRemaining = Math.ceil((new Date(c.endDate) - today) / (1000 * 60 * 60 * 24));
        alerts.push({
          id: `procurement-contract-${c.id}`,
          type: 'CONTRACT_EXPIRING',
          category: 'procurement',
          priority: daysRemaining <= 7 ? 'CRITICAL' : daysRemaining <= 14 ? 'HIGH' : 'MEDIUM',
          title: `Contrat de marché expirant`,
          description: `${c.title || c.contractNumber} expire dans ${daysRemaining} jour(s)`,
          reference: c.contractNumber,
          link: `/procurement/contracts/${c.id}`,
          dueDate: c.endDate,
          daysRemaining,
          createdAt: c.updatedAt,
        });
      });
    }

    // 3. Legal alerts
    if (!category || category === 'all' || category === 'legal') {
      // Expiring legal contracts
      const expiringLegalContracts = await Contract.findAll({
        where: {
          status: 'ACTIVE',
          endDate: {
            [Op.between]: [today, thirtyDays]
          }
        },
        order: [['endDate', 'ASC']],
        limit: 10,
      });

      expiringLegalContracts.forEach(c => {
        const daysRemaining = Math.ceil((new Date(c.endDate) - today) / (1000 * 60 * 60 * 24));
        alerts.push({
          id: `legal-contract-${c.id}`,
          type: 'LEGAL_CONTRACT_EXPIRING',
          category: 'legal',
          priority: daysRemaining <= 7 ? 'CRITICAL' : daysRemaining <= 14 ? 'HIGH' : 'MEDIUM',
          title: `Contrat juridique expirant`,
          description: `${c.title} expire dans ${daysRemaining} jour(s)`,
          reference: c.reference,
          link: `/legal/contracts/${c.id}`,
          dueDate: c.endDate,
          daysRemaining,
          createdAt: c.updatedAt,
        });
      });

      // Pending legal alerts
      const pendingLegalAlerts = await LegalAlert.findAll({
        where: {
          status: 'PENDING',
        },
        order: [
          [sequelize.literal("CASE priority WHEN 'CRITICAL' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'MEDIUM' THEN 3 ELSE 4 END"), 'ASC'],
          ['createdAt', 'DESC']
        ],
        limit: 10,
      });

      pendingLegalAlerts.forEach(a => {
        alerts.push({
          id: `legal-alert-${a.id}`,
          type: 'LEGAL_ALERT',
          category: 'legal',
          priority: a.priority || 'MEDIUM',
          title: a.title,
          description: a.description,
          link: `/legal/alerts?id=${a.id}`,
          dueDate: a.dueDate,
          createdAt: a.createdAt,
        });
      });
    }

    // Filter by priority if specified
    let filteredAlerts = alerts;
    if (priority && priority !== 'all') {
      filteredAlerts = alerts.filter(a => a.priority === priority.toUpperCase());
    }

    // Sort by priority and date
    const priorityOrder = { CRITICAL: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
    filteredAlerts.sort((a, b) => {
      const priorityDiff = (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Apply limit
    const limitedAlerts = filteredAlerts.slice(0, limit);

    // Count by category and priority
    const summary = {
      total: filteredAlerts.length,
      byCategory: {
        investments: filteredAlerts.filter(a => a.category === 'investments').length,
        procurement: filteredAlerts.filter(a => a.category === 'procurement').length,
        legal: filteredAlerts.filter(a => a.category === 'legal').length,
      },
      byPriority: {
        critical: filteredAlerts.filter(a => a.priority === 'CRITICAL').length,
        high: filteredAlerts.filter(a => a.priority === 'HIGH').length,
        medium: filteredAlerts.filter(a => a.priority === 'MEDIUM').length,
        low: filteredAlerts.filter(a => a.priority === 'LOW').length,
      },
    };

    return NextResponse.json({
      success: true,
      data: limitedAlerts,
      summary,
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des alertes', details: error.message },
      { status: 500 }
    );
  }
}
