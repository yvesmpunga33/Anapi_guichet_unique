import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const StakeholderDialogue = sequelize.define('StakeholderDialogue', {
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
    allowNull: true,
  },
  // Type d'événement
  eventType: {
    type: DataTypes.ENUM(
      'ROUNDTABLE',         // Table ronde
      'FORUM',              // Forum investisseurs
      'WORKSHOP',           // Atelier de travail
      'CONSULTATION',       // Consultation publique
      'BILATERAL',          // Réunion bilatérale
      'SECTOR_MEETING',     // Réunion sectorielle
      'WORKING_GROUP',      // Groupe de travail
      'CONFERENCE',         // Conférence
      'WEBINAR',            // Webinaire
      'OTHER'
    ),
    defaultValue: 'ROUNDTABLE',
  },
  // Statut
  status: {
    type: DataTypes.ENUM(
      'PLANNED',            // Planifié
      'INVITATIONS_SENT',   // Invitations envoyées
      'CONFIRMED',          // Confirmé
      'IN_PROGRESS',        // En cours
      'COMPLETED',          // Terminé
      'CANCELLED',          // Annulé
      'POSTPONED'           // Reporté
    ),
    defaultValue: 'PLANNED',
  },
  // Secteur concerné
  sector: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  // Thème principal
  mainTopic: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // Objectifs
  objectives: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Liste des objectifs',
  },
  // Agenda
  agenda: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Points de l\'ordre du jour',
  },
  // Lieu
  venue: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  venueAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  onlineLink: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  // Dates et heures
  scheduledDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  // Participants prévus
  expectedParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Participants réels
  actualParticipants: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Liste des participants invités (JSON)
  invitedParticipants: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Liste des personnes/organisations invitées',
  },
  // Compte-rendu
  minutes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Décisions prises
  decisions: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  // Actions à suivre
  actionItems: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Actions avec responsable et deadline',
  },
  // Recommandations
  recommendations: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  // Documents et présentations
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  // Photos de l'événement
  photos: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  // Budget
  budget: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  actualCost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  // Notes
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Prochain événement lié
  nextEventId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'stakeholder_dialogues', key: 'id' },
  },
  // Organisateur
  organizerId: {
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
  tableName: 'stakeholder_dialogues',
  timestamps: true,
  indexes: [
    { fields: ['reference'] },
    { fields: ['status'] },
    { fields: ['eventType'] },
    { fields: ['scheduledDate'] },
    { fields: ['sector'] },
  ],
});

export default StakeholderDialogue;
