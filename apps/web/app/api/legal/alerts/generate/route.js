import { NextResponse } from 'next/server';
import { LegalAlert, Contract, JuridicalText, ContractType, LegalDocumentType, sequelize } from '../../../../../models/index.js';
import { Op } from 'sequelize';

// Générer un numéro d'alerte unique (avec compteur basé sur le timestamp pour éviter les conflits)
function generateAlertNumber(index = 0) {
  const year = new Date().getFullYear();
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ALERT-${year}-${timestamp}-${String(index).padStart(3, '0')}-${random}`;
}

// Calculer la priorité en fonction des jours restants
function calculatePriority(daysRemaining) {
  if (daysRemaining <= 7) return 'CRITICAL';
  if (daysRemaining <= 15) return 'HIGH';
  if (daysRemaining <= 30) return 'MEDIUM';
  return 'LOW';
}

// POST - Générer les alertes automatiquement
export async function POST(request) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alertsCreated = [];
    const errors = [];
    let alertIndex = 0;

    // ===== ALERTES POUR LES CONTRATS =====
    const contracts = await Contract.findAll({
      where: {
        status: { [Op.in]: ['ACTIVE', 'PENDING_SIGNATURE'] },
        endDate: { [Op.not]: null },
      },
      include: [
        { model: ContractType, as: 'contractType' }
      ],
    });

    for (const contract of contracts) {
      try {
        const endDate = new Date(contract.endDate);
        const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

        // Vérifier les seuils d'alerte (30, 60, 90 jours par défaut)
        const alertDays = contract.alertDays || [30, 60, 90];

        for (const threshold of alertDays) {
          // Générer une alerte si on est dans la fenêtre du seuil
          if (daysRemaining <= threshold && daysRemaining > 0) {
            // Vérifier si une alerte existe déjà pour ce contrat et ce seuil
            const existingAlert = await LegalAlert.findOne({
              where: {
                contractId: contract.id,
                type: 'CONTRACT_EXPIRATION',
                status: { [Op.notIn]: ['RESOLVED', 'DISMISSED'] },
                description: { [Op.like]: `%seuil: ${threshold} jours%` },
              },
            });

            if (!existingAlert) {
              alertIndex++;
              const alertNumber = generateAlertNumber(alertIndex);
              const priority = calculatePriority(daysRemaining);

              const alert = await LegalAlert.create({
                alertNumber,
                type: 'CONTRACT_EXPIRATION',
                priority,
                title: `Expiration du contrat ${contract.contractNumber}`,
                description: `Le contrat "${contract.title}" expire dans ${daysRemaining} jours (seuil: ${threshold} jours). Date d'expiration: ${endDate.toLocaleDateString('fr-FR')}.`,
                triggerDate: today,
                dueDate: contract.endDate,
                contractId: contract.id,
                status: 'PENDING',
              });

              alertsCreated.push({
                type: 'CONTRACT_EXPIRATION',
                alertNumber: alert.alertNumber,
                reference: contract.contractNumber,
                daysRemaining,
              });
            }
          }
        }

        // Alerte de renouvellement si le contrat est renouvelable
        if (contract.isRenewable && contract.renewalDate) {
          const renewalDate = new Date(contract.renewalDate);
          const daysToRenewal = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));

          if (daysToRenewal <= 30 && daysToRenewal > 0) {
            const existingRenewalAlert = await LegalAlert.findOne({
              where: {
                contractId: contract.id,
                type: 'CONTRACT_RENEWAL',
                status: { [Op.notIn]: ['RESOLVED', 'DISMISSED'] },
              },
            });

            if (!existingRenewalAlert) {
              alertIndex++;
              const alertNumber = generateAlertNumber(alertIndex);

              const alert = await LegalAlert.create({
                alertNumber,
                type: 'CONTRACT_RENEWAL',
                priority: daysToRenewal <= 7 ? 'HIGH' : 'MEDIUM',
                title: `Renouvellement du contrat ${contract.contractNumber}`,
                description: `Le contrat "${contract.title}" doit etre renouvele dans ${daysToRenewal} jours. Date de renouvellement: ${renewalDate.toLocaleDateString('fr-FR')}.`,
                triggerDate: today,
                dueDate: contract.renewalDate,
                contractId: contract.id,
                status: 'PENDING',
              });

              alertsCreated.push({
                type: 'CONTRACT_RENEWAL',
                alertNumber: alert.alertNumber,
                reference: contract.contractNumber,
                daysRemaining: daysToRenewal,
              });
            }
          }
        }
      } catch (contractError) {
        console.error('Contract error:', contractError);
        errors.push({
          type: 'CONTRACT',
          id: contract.id,
          error: contractError.message,
        });
      }
    }

    // ===== ALERTES POUR LES TEXTES JURIDIQUES =====
    const texts = await JuridicalText.findAll({
      where: {
        status: 'ACTIVE',
        expirationDate: { [Op.not]: null },
      },
      include: [
        { model: LegalDocumentType, as: 'documentType' }
      ],
    });

    for (const text of texts) {
      try {
        const expirationDate = new Date(text.expirationDate);
        const daysRemaining = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));

        // Alertes à 30, 60, 90 jours
        const alertThresholds = [30, 60, 90];

        for (const threshold of alertThresholds) {
          if (daysRemaining <= threshold && daysRemaining > 0) {
            const existingAlert = await LegalAlert.findOne({
              where: {
                documentId: text.id,
                type: 'DOCUMENT_REVIEW',
                status: { [Op.notIn]: ['RESOLVED', 'DISMISSED'] },
                description: { [Op.like]: `%seuil: ${threshold} jours%` },
              },
            });

            if (!existingAlert) {
              alertIndex++;
              const alertNumber = generateAlertNumber(alertIndex);
              const priority = calculatePriority(daysRemaining);

              const alert = await LegalAlert.create({
                alertNumber,
                type: 'DOCUMENT_REVIEW',
                priority,
                title: `Expiration du texte ${text.documentNumber}`,
                description: `Le texte juridique "${text.title}" expire dans ${daysRemaining} jours (seuil: ${threshold} jours). Date d'expiration: ${expirationDate.toLocaleDateString('fr-FR')}.`,
                triggerDate: today,
                dueDate: text.expirationDate,
                documentId: text.id,
                status: 'PENDING',
              });

              alertsCreated.push({
                type: 'DOCUMENT_REVIEW',
                alertNumber: alert.alertNumber,
                reference: text.documentNumber,
                daysRemaining,
              });
            }
          }
        }
      } catch (textError) {
        console.error('Text error:', textError);
        errors.push({
          type: 'JURIDICAL_TEXT',
          id: text.id,
          error: textError.message,
        });
      }
    }

    // ===== ALERTES POUR LES CONTRATS DÉJÀ EXPIRÉS =====
    const expiredContracts = await Contract.findAll({
      where: {
        status: 'ACTIVE',
        endDate: { [Op.lt]: today },
      },
    });

    for (const contract of expiredContracts) {
      try {
        const existingExpiredAlert = await LegalAlert.findOne({
          where: {
            contractId: contract.id,
            type: 'CONTRACT_EXPIRATION',
            status: { [Op.notIn]: ['RESOLVED', 'DISMISSED'] },
            title: { [Op.like]: '%EXPIRE%' },
          },
        });

        if (!existingExpiredAlert) {
          alertIndex++;
          const alertNumber = generateAlertNumber(alertIndex);

          const alert = await LegalAlert.create({
            alertNumber,
            type: 'CONTRACT_EXPIRATION',
            priority: 'CRITICAL',
            title: `CONTRAT EXPIRE: ${contract.contractNumber}`,
            description: `ATTENTION: Le contrat "${contract.title}" est EXPIRE depuis le ${new Date(contract.endDate).toLocaleDateString('fr-FR')}. Action immediate requise.`,
            triggerDate: today,
            dueDate: contract.endDate,
            contractId: contract.id,
            status: 'PENDING',
          });

          alertsCreated.push({
            type: 'CONTRACT_EXPIRATION',
            alertNumber: alert.alertNumber,
            reference: contract.contractNumber,
            daysRemaining: 0,
            expired: true,
          });
        }
      } catch (expiredError) {
        console.error('Expired contract error:', expiredError);
        errors.push({
          type: 'EXPIRED_CONTRACT',
          id: contract.id,
          error: expiredError.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${alertsCreated.length} alerte(s) generee(s)`,
      alertsCreated,
      errors: errors.length > 0 ? errors : undefined,
      summary: {
        contractsScanned: contracts.length + expiredContracts.length,
        textsScanned: texts.length,
        alertsGenerated: alertsCreated.length,
        errorsCount: errors.length,
      },
    });

  } catch (error) {
    console.error('Error generating alerts:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la generation des alertes', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Statistiques des alertes
export async function GET(request) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Compter les alertes par statut
    const statusCounts = await LegalAlert.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true,
    });

    // Compter les alertes par priorité (non résolues)
    const priorityCounts = await LegalAlert.findAll({
      attributes: [
        'priority',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        status: { [Op.notIn]: ['RESOLVED', 'DISMISSED'] }
      },
      group: ['priority'],
      raw: true,
    });

    // Compter les alertes par type (non résolues)
    const typeCounts = await LegalAlert.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        status: { [Op.notIn]: ['RESOLVED', 'DISMISSED'] }
      },
      group: ['type'],
      raw: true,
    });

    // Alertes urgentes (due dans les 7 prochains jours)
    const urgentCount = await LegalAlert.count({
      where: {
        status: { [Op.notIn]: ['RESOLVED', 'DISMISSED'] },
        dueDate: {
          [Op.between]: [today, new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)]
        }
      }
    });

    // Dernière génération
    const lastAlert = await LegalAlert.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['createdAt'],
    });

    return NextResponse.json({
      stats: {
        byStatus: statusCounts.reduce((acc, item) => ({ ...acc, [item.status]: parseInt(item.count) }), {}),
        byPriority: priorityCounts.reduce((acc, item) => ({ ...acc, [item.priority]: parseInt(item.count) }), {}),
        byType: typeCounts.reduce((acc, item) => ({ ...acc, [item.type]: parseInt(item.count) }), {}),
        urgent: urgentCount,
        lastGenerated: lastAlert?.createdAt || null,
      }
    });

  } catch (error) {
    console.error('Error fetching alert stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des statistiques' },
      { status: 500 }
    );
  }
}
