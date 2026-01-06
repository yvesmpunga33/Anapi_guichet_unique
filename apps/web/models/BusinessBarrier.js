import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const BusinessBarrier = sequelize.define('BusinessBarrier', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Type d'obstacle
  category: {
    type: DataTypes.ENUM(
      'ADMINISTRATIVE',  // Délais, paperasse
      'FISCAL',          // Taxes, impôts
      'REGULATORY',      // Lois, normes
      'LAND',            // Foncier, titre
      'CUSTOMS',         // Douanes, import/export
      'LABOR',           // Main d'oeuvre, permis travail
      'INFRASTRUCTURE',  // Routes, électricité
      'FINANCIAL',       // Accès crédit, devises
      'CORRUPTION',      // Corruption, tracasseries
      'OTHER'
    ),
    defaultValue: 'ADMINISTRATIVE',
  },
  // Niveau de gravité
  severity: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    defaultValue: 'MEDIUM',
  },
  // Statut du dossier
  status: {
    type: DataTypes.ENUM(
      'REPORTED',        // Signalé
      'ACKNOWLEDGED',    // Pris en compte
      'UNDER_ANALYSIS',  // En analyse
      'IN_PROGRESS',     // En cours de résolution
      'ESCALATED',       // Escaladé
      'RESOLVED',        // Résolu
      'CLOSED',          // Fermé
      'REJECTED'         // Rejeté (non fondé)
    ),
    defaultValue: 'REPORTED',
  },
  // Impact estimé
  estimatedImpact: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'Impact financier estimé en USD',
  },
  // Administration concernée
  concernedAdministration: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Province concernée
  province: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  // Secteur économique concerné
  sector: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  // Source du signalement
  reportSource: {
    type: DataTypes.ENUM('INVESTOR', 'AGENT', 'MINISTRY', 'PUBLIC', 'SURVEY'),
    defaultValue: 'INVESTOR',
  },
  // Données du rapporteur (si externe)
  reporterName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  reporterEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  reporterPhone: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  // Dates importantes
  reportedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  acknowledgedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Délai de résolution objectif (jours)
  targetResolutionDays: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },
  // Solution apportée
  resolution: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resolutionType: {
    type: DataTypes.ENUM(
      'PROCEDURE_SIMPLIFIED',   // Procédure simplifiée
      'REGULATION_CHANGED',     // Réglementation modifiée
      'TRAINING_PROVIDED',      // Formation fournie
      'MEDIATION_SUCCESS',      // Médiation réussie
      'ESCALATED_RESOLVED',     // Résolu après escalade
      'NOT_APPLICABLE',         // Non applicable
      'OTHER'
    ),
    allowNull: true,
  },
  // Notes internes
  internalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Pièces jointes (JSON array of file paths)
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  // Références
  investorId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'investors', key: 'id' },
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'investments_projects', key: 'id' },
  },
  assignedToId: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'User ID (CUID format)',
  },
  createdById: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'User ID (CUID format)',
  },
  resolvedById: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'User ID (CUID format)',
  },
}, {
  tableName: 'business_barriers',
  timestamps: true,
  indexes: [
    { fields: ['reference'] },
    { fields: ['status'] },
    { fields: ['category'] },
    { fields: ['severity'] },
    { fields: ['investorId'] },
    { fields: ['projectId'] },
    { fields: ['reportedAt'] },
  ],
});

export default BusinessBarrier;
