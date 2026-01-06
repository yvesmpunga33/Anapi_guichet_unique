import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const LegalProposal = sequelize.define('LegalProposal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  reference: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Résumé de la proposition',
  },
  fullText: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Texte complet de la proposition',
  },
  // Type de proposition
  proposalType: {
    type: DataTypes.ENUM(
      'LAW',                // Projet de loi
      'DECREE',             // Projet de décret
      'ORDER',              // Projet d'arrêté
      'CIRCULAR',           // Projet de circulaire
      'REGULATION',         // Projet de règlement
      'AMENDMENT',          // Amendement
      'RECOMMENDATION',     // Recommandation
      'OPINION',            // Avis motivé
      'OTHER'
    ),
    defaultValue: 'RECOMMENDATION',
  },
  // Domaine concerné
  domain: {
    type: DataTypes.ENUM(
      'INVESTMENT_CODE',    // Code des investissements
      'TAX',                // Fiscalité
      'CUSTOMS',            // Douanes
      'LABOR',              // Droit du travail
      'LAND',               // Foncier
      'ENVIRONMENT',        // Environnement
      'TRADE',              // Commerce
      'MINING',             // Mines
      'AGRICULTURE',        // Agriculture
      'FINANCE',            // Finance
      'BUSINESS_CREATION',  // Création d'entreprise
      'OTHER'
    ),
    defaultValue: 'INVESTMENT_CODE',
  },
  // Statut
  status: {
    type: DataTypes.ENUM(
      'DRAFT',              // Brouillon
      'SUBMITTED',          // Soumis
      'UNDER_REVIEW',       // En examen
      'APPROVED',           // Approuvé (interne)
      'FORWARDED',          // Transmis aux autorités
      'UNDER_DISCUSSION',   // En discussion
      'ADOPTED',            // Adopté
      'REJECTED',           // Rejeté
      'WITHDRAWN',          // Retiré
      'ARCHIVED'            // Archivé
    ),
    defaultValue: 'DRAFT',
  },
  // Priorité
  priority: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
    defaultValue: 'MEDIUM',
  },
  // Justification
  justification: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Justification et contexte',
  },
  // Impact attendu
  expectedImpact: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Obstacles visés
  targetedBarriers: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Liste des obstacles que cette proposition vise à résoudre',
  },
  // Dates
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  forwardedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  adoptedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Autorité destinataire
  targetAuthority: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Retour/Feedback reçu
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  feedbackDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Pièces jointes
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  // Notes internes
  internalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Lien vers texte juridique existant (si amendement)
  relatedTextId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'juridical_texts', key: 'id' },
  },
  // Créateur et approbateur
  createdById: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'User ID (CUID format)',
  },
  approvedById: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'User ID (CUID format)',
  },
}, {
  tableName: 'legal_proposals',
  timestamps: true,
  indexes: [
    { fields: ['reference'] },
    { fields: ['status'] },
    { fields: ['proposalType'] },
    { fields: ['domain'] },
    { fields: ['priority'] },
    { fields: ['submittedAt'] },
  ],
});

export default LegalProposal;
