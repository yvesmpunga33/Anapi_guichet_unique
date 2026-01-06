import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const BarrierResolution = sequelize.define('BarrierResolution', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  barrierId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'business_barriers', key: 'id' },
  },
  // Type d'action
  actionType: {
    type: DataTypes.ENUM(
      'STATUS_CHANGE',      // Changement de statut
      'ASSIGNMENT',         // Assignation
      'CONTACT_ADMIN',      // Contact administration
      'MEETING',            // Réunion
      'DOCUMENT_REQUEST',   // Demande de document
      'ESCALATION',         // Escalade
      'RESOLUTION',         // Résolution
      'COMMENT',            // Commentaire
      'FOLLOW_UP'           // Suivi
    ),
    allowNull: false,
  },
  // Description de l'action
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Ancien statut (pour STATUS_CHANGE)
  previousStatus: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  // Nouveau statut (pour STATUS_CHANGE)
  newStatus: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  // Contact effectué
  contactName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  contactOrganization: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  contactEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Date de l'action
  actionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  // Date de suivi prévue
  followUpDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Résultat de l'action
  outcome: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Pièces jointes
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  // Visibilité
  isInternal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Si vrai, non visible par l\'investisseur',
  },
  // Utilisateur qui a effectué l'action
  performedById: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'User ID (CUID format)',
  },
}, {
  tableName: 'barrier_resolutions',
  timestamps: true,
  indexes: [
    { fields: ['barrierId'] },
    { fields: ['actionType'] },
    { fields: ['actionDate'] },
    { fields: ['followUpDate'] },
  ],
});

export default BarrierResolution;
