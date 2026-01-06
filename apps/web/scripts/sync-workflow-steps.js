import { WorkflowStep } from '../models/index.js';

async function syncWorkflowSteps() {
  try {
    console.log('Synchronisation de la table workflow_steps...');

    // Synchroniser le modele
    await WorkflowStep.sync({ alter: true });
    console.log('Table workflow_steps synchronisee.');

    // Verifier si des etapes existent deja
    const existingCount = await WorkflowStep.count();
    if (existingCount > 0) {
      console.log(`${existingCount} etapes existent deja. Pas de seed necessaire.`);
      process.exit(0);
    }

    // Ajouter les etapes par defaut pour AGREMENT
    const agrementSteps = [
      {
        workflowType: 'AGREMENT',
        stepNumber: 1,
        name: 'Reception',
        description: 'Reception et enregistrement de la demande',
        icon: 'FileText',
        color: '#3B82F6',
        estimatedDays: 1,
        responsibleRole: 'Agent de reception',
        isRequired: true,
        isFinal: false,
        isActive: true,
      },
      {
        workflowType: 'AGREMENT',
        stepNumber: 2,
        name: 'Verification documents',
        description: 'Controle de la conformite des documents fournis',
        icon: 'CheckCircle2',
        color: '#10B981',
        estimatedDays: 3,
        responsibleRole: 'Agent de verification',
        isRequired: true,
        isFinal: false,
        isActive: true,
      },
      {
        workflowType: 'AGREMENT',
        stepNumber: 3,
        name: 'Examen fiscal',
        description: 'Analyse de la situation fiscale du demandeur',
        icon: 'Shield',
        color: '#F59E0B',
        estimatedDays: 5,
        responsibleRole: 'Agent fiscal',
        isRequired: true,
        isFinal: false,
        isActive: true,
      },
      {
        workflowType: 'AGREMENT',
        stepNumber: 4,
        name: 'Decision finale',
        description: 'Prise de decision par le comite',
        icon: 'CheckCircle2',
        color: '#8B5CF6',
        estimatedDays: 7,
        responsibleRole: 'Comite de decision',
        isRequired: true,
        isFinal: true,
        isActive: true,
      },
    ];

    // Ajouter les etapes par defaut pour DOSSIER
    const dossierSteps = [
      {
        workflowType: 'DOSSIER',
        stepNumber: 1,
        name: 'Soumission',
        description: 'Depot du dossier',
        icon: 'FileText',
        color: '#3B82F6',
        estimatedDays: 1,
        responsibleRole: 'Guichet',
        isRequired: true,
        isFinal: false,
        isActive: true,
      },
      {
        workflowType: 'DOSSIER',
        stepNumber: 2,
        name: 'Verification',
        description: 'Controle documents',
        icon: 'CheckCircle2',
        color: '#10B981',
        estimatedDays: 3,
        responsibleRole: 'Agent de verification',
        isRequired: true,
        isFinal: false,
        isActive: true,
      },
      {
        workflowType: 'DOSSIER',
        stepNumber: 3,
        name: 'Examen Technique',
        description: 'Analyse technique',
        icon: 'Settings',
        color: '#6366F1',
        estimatedDays: 5,
        responsibleRole: 'Expert technique',
        isRequired: true,
        isFinal: false,
        isActive: true,
      },
      {
        workflowType: 'DOSSIER',
        stepNumber: 4,
        name: 'Examen Juridique',
        description: 'Validation legale',
        icon: 'Shield',
        color: '#F59E0B',
        estimatedDays: 5,
        responsibleRole: 'Conseiller juridique',
        isRequired: true,
        isFinal: false,
        isActive: true,
      },
      {
        workflowType: 'DOSSIER',
        stepNumber: 5,
        name: 'Commission',
        description: 'Decision finale',
        icon: 'Users',
        color: '#EC4899',
        estimatedDays: 7,
        responsibleRole: 'Commission',
        isRequired: true,
        isFinal: false,
        isActive: true,
      },
      {
        workflowType: 'DOSSIER',
        stepNumber: 6,
        name: 'Agrement',
        description: 'Delivrance de l\'agrement',
        icon: 'CheckCircle2',
        color: '#10B981',
        estimatedDays: 2,
        responsibleRole: 'Direction',
        isRequired: true,
        isFinal: true,
        isActive: true,
      },
    ];

    // Inserer les etapes
    await WorkflowStep.bulkCreate([...agrementSteps, ...dossierSteps]);

    console.log('Etapes par defaut ajoutees avec succes:');
    console.log(`- ${agrementSteps.length} etapes pour AGREMENT`);
    console.log(`- ${dossierSteps.length} etapes pour DOSSIER`);

    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

syncWorkflowSteps();
