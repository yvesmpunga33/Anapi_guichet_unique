import WorkflowStep from '../models/WorkflowStep.js';
import sequelize from '../app/lib/sequelize.js';

// Les etapes de workflow pour le Guichet Unique (type DOSSIER)
const guichetUniqueSteps = [
  {
    workflowType: 'DOSSIER',
    stepNumber: 1,
    name: 'Soumission',
    description: 'Reception et enregistrement de la demande',
    icon: 'FileInput',
    color: '#6366F1',
    estimatedDays: 1,
    requiredDocuments: [
      { name: 'Formulaire de demande', required: true },
      { name: 'Piece d\'identite du representant', required: true },
      { name: 'RCCM ou Numero d\'identification', required: true },
    ],
    availableActions: ['submit', 'save_draft'],
    responsibleRole: 'Investisseur',
    isFinal: false,
    isRequired: true,
    isActive: true,
  },
  {
    workflowType: 'DOSSIER',
    stepNumber: 2,
    name: 'Verification documentaire',
    description: 'Verification de la completude et conformite des documents soumis',
    icon: 'FileSearch',
    color: '#8B5CF6',
    estimatedDays: 3,
    requiredDocuments: [],
    availableActions: ['approve', 'request_documents', 'reject'],
    responsibleRole: 'Agent Guichet Unique',
    isFinal: false,
    isRequired: true,
    isActive: true,
  },
  {
    workflowType: 'DOSSIER',
    stepNumber: 3,
    name: 'Analyse ANAPI',
    description: 'Examen technique et economique du dossier par les experts ANAPI',
    icon: 'ClipboardCheck',
    color: '#3B82F6',
    estimatedDays: 7,
    requiredDocuments: [
      { name: 'Etude de faisabilite', required: false },
      { name: 'Business plan', required: false },
    ],
    availableActions: ['approve', 'request_info', 'reject'],
    responsibleRole: 'Analyste ANAPI',
    isFinal: false,
    isRequired: true,
    isActive: true,
  },
  {
    workflowType: 'DOSSIER',
    stepNumber: 4,
    name: 'Transmission Ministere',
    description: 'Envoi du dossier au ministere sectoriel competent pour avis',
    icon: 'Send',
    color: '#0EA5E9',
    estimatedDays: 2,
    requiredDocuments: [],
    availableActions: ['transmit', 'hold'],
    responsibleRole: 'Coordinateur ANAPI',
    isFinal: false,
    isRequired: true,
    isActive: true,
  },
  {
    workflowType: 'DOSSIER',
    stepNumber: 5,
    name: 'Examen Ministere',
    description: 'Evaluation du dossier par le ministere sectoriel',
    icon: 'Building2',
    color: '#14B8A6',
    estimatedDays: 14,
    requiredDocuments: [
      { name: 'Avis technique ministeriel', required: true },
    ],
    availableActions: ['approve', 'request_info', 'reject'],
    responsibleRole: 'Ministere sectoriel',
    isFinal: false,
    isRequired: true,
    isActive: true,
  },
  {
    workflowType: 'DOSSIER',
    stepNumber: 6,
    name: 'Commission Interministerielle',
    description: 'Examen en commission interministerielle pour decision finale',
    icon: 'Users',
    color: '#F59E0B',
    estimatedDays: 7,
    requiredDocuments: [],
    availableActions: ['approve', 'defer', 'reject'],
    responsibleRole: 'Commission Interministerielle',
    isFinal: false,
    isRequired: false,
    isActive: true,
  },
  {
    workflowType: 'DOSSIER',
    stepNumber: 7,
    name: 'Signature DG',
    description: 'Signature par le Directeur General de l\'ANAPI',
    icon: 'PenTool',
    color: '#10B981',
    estimatedDays: 3,
    requiredDocuments: [],
    availableActions: ['sign', 'reject'],
    responsibleRole: 'Directeur General ANAPI',
    isFinal: false,
    isRequired: true,
    isActive: true,
  },
  {
    workflowType: 'DOSSIER',
    stepNumber: 8,
    name: 'Delivrance',
    description: 'Emission et remise du document administratif',
    icon: 'Award',
    color: '#22C55E',
    estimatedDays: 2,
    requiredDocuments: [],
    availableActions: ['deliver', 'notify'],
    responsibleRole: 'Agent Guichet Unique',
    isFinal: true,
    isRequired: true,
    isActive: true,
  },
];

async function seedWorkflowSteps() {
  try {
    console.log('Connexion a la base de donnees...');
    await sequelize.authenticate();
    console.log('Connexion reussie!\n');

    // Synchroniser le modele (creer la table si elle n'existe pas)
    await WorkflowStep.sync();

    // Supprimer les anciennes etapes de type DOSSIER
    console.log('Suppression des anciennes etapes DOSSIER...');
    const deleted = await WorkflowStep.destroy({
      where: { workflowType: 'DOSSIER' }
    });
    console.log(`${deleted} anciennes etapes supprimees.\n`);

    // Inserer les nouvelles etapes
    console.log('Insertion des nouvelles etapes du Guichet Unique...');
    for (const step of guichetUniqueSteps) {
      const created = await WorkflowStep.create(step);
      console.log(`  [OK] Etape ${step.stepNumber}: ${step.name}`);
    }

    console.log('\n=================================================');
    console.log('Workflow steps du Guichet Unique inseres avec succes!');
    console.log('=================================================\n');

    // Afficher un resume
    const steps = await WorkflowStep.findAll({
      where: { workflowType: 'DOSSIER', isActive: true },
      order: [['stepNumber', 'ASC']]
    });

    console.log('Resume des etapes configurees:');
    console.log('------------------------------');
    steps.forEach(step => {
      console.log(`${step.stepNumber}. ${step.name} (${step.responsibleRole}) - ${step.estimatedDays} jours`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seed:', error);
    process.exit(1);
  }
}

seedWorkflowSteps();
