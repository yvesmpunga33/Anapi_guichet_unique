import { NextResponse } from 'next/server';
import { auth } from '../../../lib/auth.js';
import { sendEmail, verifyEmailConfig } from '../../../lib/email.js';
import { Contract, LegalAlert, User } from '../../../../models/index.js';
import { Op } from 'sequelize';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// GET - Obtenir le statut des notifications et statistiques
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Verifier la configuration email
    if (action === 'verify') {
      const status = await verifyEmailConfig();
      return NextResponse.json(status);
    }

    // Statistiques des notifications
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Contrats expirant dans 30 jours
    const expiringContracts = await Contract.findAll({
      where: {
        status: 'ACTIVE',
        endDate: {
          [Op.between]: [today, thirtyDaysFromNow],
        },
      },
      order: [['endDate', 'ASC']],
    });

    // Alertes en attente
    const pendingAlerts = await LegalAlert.findAll({
      where: {
        status: 'PENDING',
      },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    // Alertes urgentes (CRITICAL ou HIGH)
    const urgentAlerts = await LegalAlert.findAll({
      where: {
        status: 'PENDING',
        priority: { [Op.in]: ['CRITICAL', 'HIGH'] },
      },
    });

    return NextResponse.json({
      emailConfigured: (await verifyEmailConfig()).configured,
      stats: {
        expiringContracts: expiringContracts.length,
        pendingAlerts: pendingAlerts.length,
        urgentAlerts: urgentAlerts.length,
      },
      expiringContracts: expiringContracts.map(c => ({
        id: c.id,
        title: c.title,
        reference: c.reference,
        endDate: c.endDate,
        daysRemaining: Math.ceil((new Date(c.endDate) - today) / (1000 * 60 * 60 * 24)),
      })),
      pendingAlerts: pendingAlerts.map(a => ({
        id: a.id,
        title: a.title,
        type: a.type,
        priority: a.priority,
      })),
    });
  } catch (error) {
    console.error('Error getting notification status:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation du statut' },
      { status: 500 }
    );
  }
}

// POST - Envoyer des notifications
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const body = await request.json();
    const { type, contractId, alertId, recipients, sendDigest } = body;

    const results = { sent: 0, failed: 0, details: [] };

    // Envoyer notification pour un contrat specifique
    if (type === 'contract_expiring' && contractId) {
      const contract = await Contract.findByPk(contractId);
      if (!contract) {
        return NextResponse.json({ error: 'Contrat non trouve' }, { status: 404 });
      }

      const today = new Date();
      const daysRemaining = Math.ceil((new Date(contract.endDate) - today) / (1000 * 60 * 60 * 24));

      // Determiner les destinataires
      let emailRecipients = recipients || [];
      if (emailRecipients.length === 0) {
        // Par defaut, envoyer aux admins juridiques
        const legalUsers = await User.findAll({
          where: {
            isActive: true,
            role: { [Op.in]: ['admin', 'legal_manager', 'legal_officer'] },
          },
        });
        emailRecipients = legalUsers.map(u => u.email).filter(Boolean);
      }

      for (const email of emailRecipients) {
        try {
          await sendEmail(email, 'contractExpiring', {
            contractTitle: contract.title,
            reference: contract.reference,
            contractType: contract.type?.name,
            value: contract.value,
            currency: contract.currency,
            expirationDate: new Date(contract.endDate).toLocaleDateString('fr-FR'),
            daysRemaining,
            priority: daysRemaining <= 7 ? 'CRITICAL' : daysRemaining <= 30 ? 'HIGH' : 'MEDIUM',
            contractUrl: `${BASE_URL}/legal/contracts/${contract.id}`,
          });
          results.sent++;
          results.details.push({ email, status: 'sent' });
        } catch (error) {
          results.failed++;
          results.details.push({ email, status: 'failed', error: error.message });
        }
      }
    }

    // Envoyer notification pour une alerte assignee
    if (type === 'alert_assignment' && alertId) {
      const alert = await LegalAlert.findByPk(alertId);
      if (!alert) {
        return NextResponse.json({ error: 'Alerte non trouvee' }, { status: 404 });
      }

      if (alert.assignedToId) {
        const assignee = await User.findByPk(alert.assignedToId);
        if (assignee?.email) {
          try {
            await sendEmail(assignee.email, 'alertAssignment', {
              assigneeName: assignee.name || assignee.email,
              alertTitle: alert.title,
              description: alert.description,
              priority: alert.priority,
              dueDate: alert.dueDate ? new Date(alert.dueDate).toLocaleDateString('fr-FR') : null,
              alertUrl: `${BASE_URL}/legal/alerts?id=${alert.id}`,
            });
            results.sent++;
            results.details.push({ email: assignee.email, status: 'sent' });
          } catch (error) {
            results.failed++;
            results.details.push({ email: assignee.email, status: 'failed', error: error.message });
          }
        }
      }
    }

    // Envoyer notification de renouvellement
    if (type === 'contract_renewal' && contractId) {
      const contract = await Contract.findByPk(contractId);
      if (!contract) {
        return NextResponse.json({ error: 'Contrat non trouve' }, { status: 404 });
      }

      let emailRecipients = recipients || [];
      if (emailRecipients.length === 0) {
        const legalUsers = await User.findAll({
          where: {
            isActive: true,
            role: { [Op.in]: ['admin', 'legal_manager'] },
          },
        });
        emailRecipients = legalUsers.map(u => u.email).filter(Boolean);
      }

      for (const email of emailRecipients) {
        try {
          await sendEmail(email, 'contractRenewalReminder', {
            contractTitle: contract.title,
            renewalType: contract.renewalType || 'MANUAL',
            contractUrl: `${BASE_URL}/legal/contracts/${contract.id}`,
            renewUrl: `${BASE_URL}/legal/contracts/${contract.id}/renew`,
          });
          results.sent++;
          results.details.push({ email, status: 'sent' });
        } catch (error) {
          results.failed++;
          results.details.push({ email, status: 'failed', error: error.message });
        }
      }
    }

    // Envoyer le digest quotidien
    if (sendDigest) {
      const today = new Date();
      const thirtyDaysFromNow = new Date(today);
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      const [expiringContracts, pendingAlerts, urgentAlerts, activeContracts] = await Promise.all([
        Contract.count({
          where: {
            status: 'ACTIVE',
            endDate: { [Op.between]: [today, thirtyDaysFromNow] },
          },
        }),
        LegalAlert.count({ where: { status: 'PENDING' } }),
        LegalAlert.findAll({
          where: {
            status: 'PENDING',
            priority: { [Op.in]: ['CRITICAL', 'HIGH'] },
          },
          limit: 5,
        }),
        Contract.count({ where: { status: 'ACTIVE' } }),
      ]);

      // Envoyer aux admins
      const admins = await User.findAll({
        where: {
          isActive: true,
          role: { [Op.in]: ['admin', 'legal_manager'] },
        },
      });

      for (const admin of admins) {
        if (!admin.email) continue;

        try {
          await sendEmail(admin.email, 'dailyDigest', {
            date: today.toLocaleDateString('fr-FR'),
            stats: {
              expiringContracts,
              pendingAlerts,
              urgentAlerts: urgentAlerts.length,
              totalContracts: activeContracts,
            },
            urgentAlerts: urgentAlerts.map(a => ({
              title: a.title,
              description: a.description,
            })),
            dashboardUrl: `${BASE_URL}/legal/dashboard`,
            unsubscribeUrl: `${BASE_URL}/settings/notifications`,
          });
          results.sent++;
          results.details.push({ email: admin.email, status: 'sent' });
        } catch (error) {
          results.failed++;
          results.details.push({ email: admin.email, status: 'failed', error: error.message });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${results.sent} notification(s) envoyee(s), ${results.failed} echec(s)`,
      results,
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi des notifications' },
      { status: 500 }
    );
  }
}
