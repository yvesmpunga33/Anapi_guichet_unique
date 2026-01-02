import WorkflowStep from '../models/WorkflowStep.js';
import sequelize from '../app/lib/sequelize.js';

// Etapes communes a tous les types du Guichet Unique
const baseSteps = [
  {
    stepNumber: 1,
    name: 'Soumission',
    description: 'Reception et enregistrement de la demande',
    icon: 'FileInput',
    color: '#6366F1',
    estimatedDays: 1,
    responsibleRole: 'Investisseur',
    isFinal: false,
    isRequired: true,
    isActive: true,
  },
  {
    stepNumber: 2,
    name: 'Verification documentaire',
    description: 'Verification de la completude et conformite des documents soumis',
    icon: 'FileSearch',
    color: '#8B5CF6',
    estimatedDays: 3,
    responsibleRole: 'Agent Guichet Unique',
    isFinal: false,
    isRequired: true,
    isActive: true,
  },
  {
    stepNumber: 3,
    name: 'Analyse ANAPI',
    description: 'Examen technique et economique du dossier par les experts ANAPI',
    icon: 'ClipboardCheck',
    color: '#3B82F6',
    estimatedDays: 7,
    responsibleRole: 'Analyste ANAPI',
    isFinal: false,
    isRequired: true,
    isActive: true,
  },
  {
    stepNumber: 4,
    name: 'Transmission Ministere',
    description: 'Envoi du dossier au ministere sectoriel competent pour avis',
    icon: 'Send',
    color: '#0EA5E9',
    estimatedDays: 2,
    responsibleRole: 'Coordinateur ANAPI',
    isFinal: false,
    isRequired: true,
    isActive: true,
  },
  {
    stepNumber: 5,
    name: 'Examen Ministere',
    description: 'Evaluation du dossier par le ministere sectoriel',
    icon: 'Building2',
    color: '#14B8A6',
    estimatedDays: 14,
    responsibleRole: 'Ministere sectoriel',
    isFinal: false,
    isRequired: true,
    isActive: true,
  },
];

// Configuration specifique par type
const typeConfigs = {
  AGREMENT_REGIME: {
    name: 'Agrements au Regime',
    finalSteps: [
      {
        stepNumber: 6,
        name: 'Commission Interministerielle',
        description: 'Examen en commission interministerielle pour decision finale',
        icon: 'Users',
        color: '#F59E0B',
        estimatedDays: 7,
        responsibleRole: 'Commission Interministerielle',
        isFinal: false,
        isRequired: true,
        isActive: true,
      },
      {
        stepNumber: 7,
        name: 'Signature DG',
        description: 'Signature par le Directeur General de l\'ANAPI',
        icon: 'PenTool',
        color: '#10B981',
        estimatedDays: 3,
        responsibleRole: 'Directeur General ANAPI',
        isFinal: false,
        isRequired: true,
        isActive: true,
      },
      {
        stepNumber: 8,
        name: 'Delivrance Agrement',
        description: 'Emission et remise de l\'agrement au regime',
        icon: 'Award',
        color: '#22C55E',
        estimatedDays: 2,
        responsibleRole: 'Agent Guichet Unique',
        isFinal: true,
        isRequired: true,
        isActive: true,
      },
    ],
  },
  LICENCE_EXPLOITATION: {
    name: 'Licences d\'exploitation',
    finalSteps: [
      {
        stepNumber: 6,
        name: 'Validation technique',
        description: 'Validation technique par le service competent',
        icon: 'Settings',
        color: '#8B5CF6',
        estimatedDays: 5,
        responsibleRole: 'Service technique',
        isFinal: false,
        isRequired: true,
        isActive: true,
      },
      {
        stepNumber: 7,
        name: 'Approbation finale',
        description: 'Approbation finale et preparation de la licence',
        icon: 'CheckCircle2',
        color: '#10B981',
        estimatedDays: 3,
        responsibleRole: 'Direction ANAPI',
        isFinal: false,
        isRequired: true,
        isActive: true,
      },
      {
        stepNumber: 8,
        name: 'Delivrance Licence',
        description: 'Emission et remise de la licence d\'exploitation',
        icon: 'FileBadge',
        color: '#22C55E',
        estimatedDays: 2,
        responsibleRole: 'Agent Guichet Unique',
        isFinal: true,
        isRequired: true,
        isActive: true,
      },
    ],
  },
  PERMIS_CONSTRUCTION: {
    name: 'Permis de construction',
    finalSteps: [
      {
        stepNumber: 6,
        name: 'Inspection terrain',
        description: 'Visite et inspection du site de construction',
        icon: 'MapPin',
        color: '#F59E0B',
        estimatedDays: 7,
        responsibleRole: 'Inspecteur urbanisme',
        isFinal: false,
        isRequired: true,
        isActive: true,
      },
      {
        stepNumber: 7,
        name: 'Validation urbanisme',
        description: 'Validation par le service d\'urbanisme',
        icon: 'Building',
        color: '#0EA5E9',
        estimatedDays: 5,
        responsibleRole: 'Service urbanisme',
        isFinal: false,
        isRequired: true,
        isActive: true,
      },
      {
        stepNumber: 8,
        name: 'Delivrance Permis',
        description: 'Emission et remise du permis de construction',
        icon: 'ScrollText',
        color: '#22C55E',
        estimatedDays: 2,
        responsibleRole: 'Agent Guichet Unique',
        isFinal: true,
        isRequired: true,
        isActive: true,
      },
    ],
  },
  AUTORISATION_ACTIVITE: {
    name: 'Autorisations d\'activite',
    finalSteps: [
      {
        stepNumber: 6,
        name: 'Verification conformite',
        description: 'Verification de la conformite aux normes sectorielles',
        icon: 'Shield',
        color: '#8B5CF6',
        estimatedDays: 5,
        responsibleRole: 'Service conformite',
        isFinal: false,
        isRequired: true,
        isActive: true,
      },
      {
        stepNumber: 7,
        name: 'Approbation autorite',
        description: 'Approbation par l\'autorite competente',
        icon: 'UserCheck',
        color: '#10B981',
        estimatedDays: 3,
        responsibleRole: 'Autorite sectorielle',
        isFinal: false,
        isRequired: true,
        isActive: true,
      },
      {
        stepNumber: 8,
        name: 'Delivrance Autorisation',
        description: 'Emission et remise de l\'autorisation d\'activite',
        icon: 'FileCheck',
        color: '#22C55E',
        estimatedDays: 2,
        responsibleRole: 'Agent Guichet Unique',
        isFinal: true,
        isRequired: true,
        isActive: true,
      },
    ],
  },
};

async function seedWorkflowSteps() {
  try {
    console.log('Connexion a la base de donnees...');
    await sequelize.authenticate();
    console.log('Connexion reussie!\n');

    // Synchroniser le modele
    await WorkflowStep.sync();

    // Supprimer les anciennes etapes de type DOSSIER (ancien type)
    console.log('Suppression des anciennes etapes DOSSIER...');
    const deletedDossier = await WorkflowStep.destroy({
      where: { workflowType: 'DOSSIER' }
    });
    console.log(`${deletedDossier} anciennes etapes DOSSIER supprimees.\n`);

    // Pour chaque type du Guichet Unique
    for (const [workflowType, config] of Object.entries(typeConfigs)) {
      console.log(`\n========================================`);
      console.log(`Configuration: ${config.name} (${workflowType})`);
      console.log(`========================================`);

      // Supprimer les anciennes etapes de ce type
      const deleted = await WorkflowStep.destroy({
        where: { workflowType }
      });
      console.log(`${deleted} anciennes etapes supprimees.`);

      // Combiner les etapes de base avec les etapes finales specifiques
      const allSteps = [...baseSteps, ...config.finalSteps];

      // Inserer les nouvelles etapes
      console.log(`Insertion de ${allSteps.length} etapes...`);
      for (const step of allSteps) {
        await WorkflowStep.create({
          ...step,
          workflowType,
          requiredDocuments: [],
          availableActions: ['approve', 'reject', 'request_info'],
        });
        console.log(`  [OK] Etape ${step.stepNumber}: ${step.name}`);
      }
    }

    console.log('\n=================================================');
    console.log('Tous les workflows du Guichet Unique ont ete configures!');
    console.log('=================================================\n');

    // Resume
    console.log('Resume par type:');
    console.log('-----------------');
    for (const [workflowType, config] of Object.entries(typeConfigs)) {
      const count = await WorkflowStep.count({ where: { workflowType, isActive: true } });
      console.log(`${config.name}: ${count} etapes`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seed:', error);
    process.exit(1);
  }
}

seedWorkflowSteps();
