/**
 * Script de simulation des données pour le module Ministères
 * Génère des demandes d'autorisations, licences et permis pour chaque ministère
 */

import {
  Ministry,
  MinistryWorkflow,
  MinistryRequest,
  MinistryRequestHistory,
} from '../models/index.js';

// Données de workflow par type de demande
const workflowTemplates = {
  AUTORISATION: [
    { stepName: 'Réception de la demande', description: 'Vérification de la complétude du dossier', responsibleRole: 'Agent de réception', estimatedDays: 2, requiredDocuments: ['Formulaire de demande', 'Pièce d\'identité'] },
    { stepName: 'Analyse technique', description: 'Étude technique du dossier', responsibleRole: 'Analyste technique', estimatedDays: 5, requiredDocuments: ['Plan d\'affaires', 'Étude de faisabilité'] },
    { stepName: 'Vérification juridique', description: 'Conformité légale et réglementaire', responsibleRole: 'Juriste', estimatedDays: 3, requiredDocuments: ['Statuts de l\'entreprise', 'RCCM'] },
    { stepName: 'Validation du chef de service', description: 'Approbation par le responsable', responsibleRole: 'Chef de service', estimatedDays: 2, requiredDocuments: [] },
    { stepName: 'Décision finale', description: 'Signature de l\'autorisation', responsibleRole: 'Directeur', estimatedDays: 3, requiredDocuments: [] },
  ],
  LICENCE: [
    { stepName: 'Enregistrement', description: 'Enregistrement de la demande de licence', responsibleRole: 'Agent d\'accueil', estimatedDays: 1, requiredDocuments: ['Formulaire de licence', 'ID National'] },
    { stepName: 'Inspection préalable', description: 'Visite des locaux ou du site', responsibleRole: 'Inspecteur', estimatedDays: 7, requiredDocuments: ['Certificat de conformité', 'Plan de localisation'] },
    { stepName: 'Évaluation des capacités', description: 'Vérification des compétences et ressources', responsibleRole: 'Expert technique', estimatedDays: 5, requiredDocuments: ['CV des responsables', 'Liste des équipements'] },
    { stepName: 'Commission d\'attribution', description: 'Délibération de la commission', responsibleRole: 'Commission', estimatedDays: 3, requiredDocuments: [] },
    { stepName: 'Émission de la licence', description: 'Délivrance du document officiel', responsibleRole: 'Secrétariat', estimatedDays: 2, requiredDocuments: [] },
  ],
  PERMIS: [
    { stepName: 'Dépôt de dossier', description: 'Réception et vérification initiale', responsibleRole: 'Agent de guichet', estimatedDays: 1, requiredDocuments: ['Demande de permis', 'Pièce d\'identité'] },
    { stepName: 'Étude de conformité', description: 'Vérification des normes applicables', responsibleRole: 'Technicien', estimatedDays: 4, requiredDocuments: ['Plans techniques', 'Certificats'] },
    { stepName: 'Enquête de terrain', description: 'Vérification sur site', responsibleRole: 'Inspecteur terrain', estimatedDays: 5, requiredDocuments: ['Rapport d\'inspection précédent'] },
    { stepName: 'Avis technique', description: 'Recommandation technique', responsibleRole: 'Ingénieur', estimatedDays: 3, requiredDocuments: [] },
    { stepName: 'Délivrance du permis', description: 'Signature et remise du permis', responsibleRole: 'Autorité compétente', estimatedDays: 2, requiredDocuments: [] },
  ],
};

// Données de demandes simulées
const sampleApplicants = [
  { name: 'SARL Mining Congo', email: 'contact@miningcongo.cd', phone: '+243 812 345 678', type: 'COMPANY', rccm: 'CD/KIN/RCCM/24-A-12345', idNat: 'A1234567X', nif: 'A123456789' },
  { name: 'Jean-Pierre Kabongo', email: 'jpkabongo@gmail.com', phone: '+243 998 765 432', type: 'INDIVIDUAL', rccm: null, idNat: 'B9876543Y', nif: null },
  { name: 'Global Invest RDC', email: 'info@globalinvest.cd', phone: '+243 815 555 999', type: 'INVESTOR', rccm: 'CD/KIN/RCCM/24-B-54321', idNat: 'C5432167Z', nif: 'B987654321' },
  { name: 'Entreprise Agricole du Kasai', email: 'agrikasai@yahoo.fr', phone: '+243 820 111 222', type: 'COMPANY', rccm: 'CD/KAS/RCCM/23-A-11111', idNat: 'D1111111A', nif: 'C111111111' },
  { name: 'Marie Lukusa', email: 'mlukusa@outlook.com', phone: '+243 991 222 333', type: 'INDIVIDUAL', rccm: null, idNat: 'E2222222B', nif: null },
  { name: 'Société Forestière du Congo', email: 'sfc@sfcongo.cd', phone: '+243 818 333 444', type: 'COMPANY', rccm: 'CD/EQU/RCCM/24-C-33333', idNat: 'F3333333C', nif: 'D333333333' },
  { name: 'Tech Solutions Kinshasa', email: 'contact@techsol.cd', phone: '+243 825 444 555', type: 'COMPANY', rccm: 'CD/KIN/RCCM/24-D-44444', idNat: 'G4444444D', nif: 'E444444444' },
  { name: 'Pierre Mbuyi', email: 'pmbuyi@gmail.com', phone: '+243 992 555 666', type: 'INDIVIDUAL', rccm: null, idNat: 'H5555555E', nif: null },
  { name: 'Cimenterie du Kongo Central', email: 'ciment@ckc.cd', phone: '+243 816 666 777', type: 'COMPANY', rccm: 'CD/KOC/RCCM/23-E-55555', idNat: 'I6666666F', nif: 'F555555555' },
  { name: 'Import Export Lubumbashi', email: 'ielub@business.cd', phone: '+243 827 777 888', type: 'COMPANY', rccm: 'CD/LUB/RCCM/24-F-66666', idNat: 'J7777777G', nif: 'G666666666' },
];

const subjects = {
  AUTORISATION: [
    'Autorisation d\'exploitation minière artisanale',
    'Autorisation d\'importation de matériel industriel',
    'Autorisation de construction d\'une usine',
    'Autorisation d\'exercice d\'activité commerciale',
    'Autorisation de transport de marchandises dangereuses',
    'Autorisation d\'exploitation agricole',
    'Autorisation d\'installation de panneaux solaires',
    'Autorisation de forage de puits',
  ],
  LICENCE: [
    'Licence d\'exploitation forestière',
    'Licence de télécommunications',
    'Licence de production pharmaceutique',
    'Licence d\'importation de produits pétroliers',
    'Licence de pêche industrielle',
    'Licence de production agroalimentaire',
    'Licence d\'exploitation de carrière',
    'Licence de transport public',
  ],
  PERMIS: [
    'Permis de construire - Bâtiment industriel',
    'Permis environnemental - Étude d\'impact',
    'Permis de travail pour expatriés',
    'Permis d\'exploitation de débit de boissons',
    'Permis de séjour prolongé',
    'Permis de recherche minière',
    'Permis de circulation spéciale',
    'Permis sanitaire d\'établissement',
  ],
};

const provinces = ['Kinshasa', 'Haut-Katanga', 'Kongo Central', 'Nord-Kivu', 'Sud-Kivu', 'Kasaï', 'Équateur', 'Ituri'];
const sectors = ['Mines', 'Agriculture', 'Industrie', 'Commerce', 'Transport', 'Énergie', 'Environnement', 'Santé'];
const statuses = ['DRAFT', 'SUBMITTED', 'IN_PROGRESS', 'PENDING_DOCUMENTS', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
const priorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRequestNumber(type, index) {
  const year = new Date().getFullYear();
  const prefix = type === 'AUTORISATION' ? 'AUT' : type === 'LICENCE' ? 'LIC' : 'PER';
  return `${prefix}-${year}-${String(index).padStart(5, '0')}`;
}

function randomDate(startDays, endDays) {
  const now = new Date();
  const start = new Date(now.getTime() - startDays * 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() - endDays * 24 * 60 * 60 * 1000);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedMinistryData() {
  try {
    console.log('🚀 Démarrage de la simulation des données ministères...\n');

    // Récupérer tous les ministères actifs
    const ministries = await Ministry.findAll({ where: { isActive: true } });

    if (ministries.length === 0) {
      console.log('❌ Aucun ministère trouvé. Veuillez d\'abord créer des ministères.');
      return;
    }

    console.log(`📋 ${ministries.length} ministères trouvés\n`);

    let requestCounter = { AUTORISATION: 1, LICENCE: 1, PERMIS: 1 };
    let totalWorkflows = 0;
    let totalRequests = 0;

    for (const ministry of ministries) {
      console.log(`\n🏛️  Traitement du ministère: ${ministry.name}`);

      // 1. Créer les workflows pour chaque type
      for (const [requestType, steps] of Object.entries(workflowTemplates)) {
        // Supprimer les workflows existants
        await MinistryWorkflow.destroy({ where: { ministryId: ministry.id, requestType } });

        // Créer les nouvelles étapes
        for (let i = 0; i < steps.length; i++) {
          await MinistryWorkflow.create({
            ministryId: ministry.id,
            requestType,
            stepNumber: i + 1,
            stepName: steps[i].stepName,
            description: steps[i].description,
            responsibleRole: steps[i].responsibleRole,
            estimatedDays: steps[i].estimatedDays,
            requiredDocuments: steps[i].requiredDocuments,
            isActive: true,
          });
          totalWorkflows++;
        }
        console.log(`   ✓ ${steps.length} étapes de workflow créées pour ${requestType}`);
      }

      // 2. Créer des demandes pour chaque type
      const requestTypes = ['AUTORISATION', 'LICENCE', 'PERMIS'];

      for (const requestType of requestTypes) {
        const numRequests = randomNumber(3, 8); // 3 à 8 demandes par type par ministère

        for (let i = 0; i < numRequests; i++) {
          const applicant = randomElement(sampleApplicants);
          const status = randomElement(statuses);
          const priority = randomElement(priorities);
          const subject = randomElement(subjects[requestType]);

          // Calculer les étapes selon le statut
          const workflowSteps = workflowTemplates[requestType];
          const totalSteps = workflowSteps.length;
          let currentStep = 1;

          if (status === 'APPROVED' || status === 'REJECTED') {
            currentStep = totalSteps;
          } else if (status === 'IN_PROGRESS' || status === 'UNDER_REVIEW') {
            currentStep = randomNumber(2, totalSteps - 1);
          } else if (status === 'PENDING_DOCUMENTS') {
            currentStep = randomNumber(1, Math.ceil(totalSteps / 2));
          }

          const createdAt = randomDate(90, 1);
          const submittedAt = status !== 'DRAFT' ? new Date(createdAt.getTime() + randomNumber(1, 3) * 24 * 60 * 60 * 1000) : null;

          let decisionDate = null;
          if (status === 'APPROVED' || status === 'REJECTED') {
            decisionDate = new Date(submittedAt.getTime() + randomNumber(7, 30) * 24 * 60 * 60 * 1000);
          }

          const request = await MinistryRequest.create({
            requestNumber: generateRequestNumber(requestType, requestCounter[requestType]++),
            requestType,
            ministryId: ministry.id,
            applicantType: applicant.type,
            applicantName: applicant.name,
            applicantEmail: applicant.email,
            applicantPhone: applicant.phone,
            applicantAddress: `Avenue de l'Investissement, N°${randomNumber(1, 500)}, ${randomElement(provinces)}`,
            rccm: applicant.rccm,
            idNat: applicant.idNat,
            nif: applicant.nif,
            subject,
            description: `Demande de ${subject.toLowerCase()} pour le compte de ${applicant.name}. Cette demande concerne les activités dans le secteur ${randomElement(sectors).toLowerCase()}.`,
            sector: randomElement(sectors),
            province: randomElement(provinces),
            city: randomElement(['Kinshasa', 'Lubumbashi', 'Goma', 'Kisangani', 'Mbuji-Mayi', 'Kananga', 'Matadi', 'Bukavu']),
            investmentAmount: applicant.type === 'COMPANY' || applicant.type === 'INVESTOR' ? randomNumber(10000, 5000000) : null,
            currency: 'USD',
            status,
            currentStep,
            totalSteps,
            priority,
            submittedAt,
            lastStepAt: submittedAt ? new Date(submittedAt.getTime() + randomNumber(1, 14) * 24 * 60 * 60 * 1000) : null,
            dueDate: submittedAt ? new Date(submittedAt.getTime() + 30 * 24 * 60 * 60 * 1000) : null,
            decisionDate,
            decisionNote: status === 'APPROVED' ? 'Dossier conforme aux exigences réglementaires.' : null,
            rejectionReason: status === 'REJECTED' ? 'Dossier incomplet ou non conforme aux critères requis.' : null,
            createdAt,
          });

          // 3. Créer l'historique des actions
          const actions = [
            { action: 'CREATED', stepNumber: 1, stepName: 'Création', previousStatus: null, newStatus: 'DRAFT' },
          ];

          if (status !== 'DRAFT') {
            actions.push({ action: 'SUBMITTED', stepNumber: 1, stepName: workflowSteps[0].stepName, previousStatus: 'DRAFT', newStatus: 'SUBMITTED' });
          }

          if (['IN_PROGRESS', 'UNDER_REVIEW', 'PENDING_DOCUMENTS', 'APPROVED', 'REJECTED'].includes(status)) {
            for (let step = 1; step < currentStep; step++) {
              actions.push({
                action: 'STEP_COMPLETED',
                stepNumber: step,
                stepName: workflowSteps[step - 1].stepName,
                previousStatus: step === 1 ? 'SUBMITTED' : 'IN_PROGRESS',
                newStatus: 'IN_PROGRESS',
              });
            }
          }

          if (status === 'PENDING_DOCUMENTS') {
            actions.push({
              action: 'DOCUMENTS_REQUESTED',
              stepNumber: currentStep,
              stepName: workflowSteps[currentStep - 1].stepName,
              previousStatus: 'IN_PROGRESS',
              newStatus: 'PENDING_DOCUMENTS',
            });
          }

          if (status === 'APPROVED') {
            actions.push({
              action: 'APPROVED',
              stepNumber: totalSteps,
              stepName: workflowSteps[totalSteps - 1].stepName,
              previousStatus: 'UNDER_REVIEW',
              newStatus: 'APPROVED',
              comment: 'Demande approuvée après vérification complète du dossier.',
            });
          }

          if (status === 'REJECTED') {
            actions.push({
              action: 'REJECTED',
              stepNumber: currentStep,
              stepName: workflowSteps[currentStep - 1].stepName,
              previousStatus: 'UNDER_REVIEW',
              newStatus: 'REJECTED',
              comment: 'Demande rejetée - critères non satisfaits.',
            });
          }

          // Insérer l'historique
          let historyDate = createdAt;
          for (const historyAction of actions) {
            await MinistryRequestHistory.create({
              requestId: request.id,
              stepNumber: historyAction.stepNumber,
              stepName: historyAction.stepName,
              action: historyAction.action,
              previousStatus: historyAction.previousStatus,
              newStatus: historyAction.newStatus,
              comment: historyAction.comment || null,
              performedByName: 'Système (Simulation)',
              createdAt: historyDate,
            });
            historyDate = new Date(historyDate.getTime() + randomNumber(1, 5) * 24 * 60 * 60 * 1000);
          }

          totalRequests++;
        }

        console.log(`   ✓ ${numRequests} demandes de ${requestType} créées`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ SIMULATION TERMINÉE AVEC SUCCÈS!');
    console.log('='.repeat(60));
    console.log(`📊 Résumé:`);
    console.log(`   • ${ministries.length} ministères traités`);
    console.log(`   • ${totalWorkflows} étapes de workflow créées`);
    console.log(`   • ${totalRequests} demandes créées au total`);
    console.log(`   • Autorisations: ${requestCounter.AUTORISATION - 1}`);
    console.log(`   • Licences: ${requestCounter.LICENCE - 1}`);
    console.log(`   • Permis: ${requestCounter.PERMIS - 1}`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Erreur lors de la simulation:', error);
    throw error;
  }
}

// Exécution
seedMinistryData()
  .then(() => {
    console.log('🎉 Script terminé.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
