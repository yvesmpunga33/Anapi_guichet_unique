import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const MediationCase = sequelize.define('MediationCase', {
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
  // Type de litige
  disputeType: {
    type: DataTypes.ENUM(
      'CONTRACT',           // Litige contractuel
      'TAX',                // Litige fiscal
      'LABOR',              // Litige du travail
      'LAND',               // Litige foncier
      'PERMIT',             // Litige sur permis/licence
      'CUSTOMS',            // Litige douanier
      'ADMINISTRATIVE',     // Litige administratif
      'COMMERCIAL',         // Litige commercial
      'ENVIRONMENTAL',      // Litige environnemental
      'OTHER'
    ),
    defaultValue: 'ADMINISTRATIVE',
  },
  // Statut
  status: {
    type: DataTypes.ENUM(
      'SUBMITTED',          // Soumis
      'ACCEPTED',           // Accepté pour médiation
      'REJECTED',           // Rejeté
      'SCHEDULED',          // Séance programmée
      'IN_MEDIATION',       // En cours de médiation
      'AGREEMENT_REACHED',  // Accord trouvé
      'FAILED',             // Échec de médiation
      'CLOSED',             // Fermé
      'REFERRED_COURT'      // Renvoyé au tribunal
    ),
    defaultValue: 'SUBMITTED',
  },
  // Priorité
  priority: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
    defaultValue: 'MEDIUM',
  },
  // Montant en litige
  disputedAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
  },
  // Partie plaignante
  complainantType: {
    type: DataTypes.ENUM('INVESTOR', 'COMPANY', 'INDIVIDUAL'),
    defaultValue: 'INVESTOR',
  },
  complainantName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  complainantContact: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Partie adverse
  respondentType: {
    type: DataTypes.ENUM('MINISTRY', 'AGENCY', 'COMPANY', 'INDIVIDUAL'),
    defaultValue: 'MINISTRY',
  },
  respondentName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  respondentContact: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  respondentOrganization: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Dates
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  acceptedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  firstSessionAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Nombre de sessions
  sessionsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Résultat
  outcome: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  agreementSummary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Satisfaction (1-5)
  complainantSatisfaction: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  respondentSatisfaction: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Notes
  internalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Pièces jointes
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
  barrierId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'business_barriers', key: 'id' },
    comment: 'Lien optionnel vers un obstacle signalé',
  },
  mediatorId: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'User ID (CUID format)',
  },
  createdById: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'User ID (CUID format)',
  },
}, {
  tableName: 'mediation_cases',
  timestamps: true,
  indexes: [
    { fields: ['reference'] },
    { fields: ['status'] },
    { fields: ['disputeType'] },
    { fields: ['priority'] },
    { fields: ['investorId'] },
    { fields: ['submittedAt'] },
  ],
});

export default MediationCase;
