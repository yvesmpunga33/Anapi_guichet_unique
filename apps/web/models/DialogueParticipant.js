import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const DialogueParticipant = sequelize.define('DialogueParticipant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  dialogueId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'stakeholder_dialogues', key: 'id' },
  },
  // Type de participant
  participantType: {
    type: DataTypes.ENUM(
      'INVESTOR',           // Investisseur
      'GOVERNMENT',         // Représentant gouvernemental
      'MINISTRY',           // Représentant ministère
      'PRIVATE_SECTOR',     // Secteur privé
      'CIVIL_SOCIETY',      // Société civile
      'INTERNATIONAL_ORG',  // Organisation internationale
      'EXPERT',             // Expert
      'MEDIA',              // Média
      'ANAPI_STAFF',        // Staff ANAPI
      'OTHER'
    ),
    defaultValue: 'INVESTOR',
  },
  // Informations du participant
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Titre/fonction',
  },
  organization: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  // Statut de participation
  invitationStatus: {
    type: DataTypes.ENUM(
      'PENDING',        // En attente
      'SENT',           // Invitation envoyée
      'CONFIRMED',      // Confirmé
      'DECLINED',       // Décliné
      'TENTATIVE',      // Peut-être
      'CANCELLED'       // Annulé
    ),
    defaultValue: 'PENDING',
  },
  attended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Rôle dans l'événement
  role: {
    type: DataTypes.ENUM(
      'ORGANIZER',      // Organisateur
      'SPEAKER',        // Intervenant
      'PANELIST',       // Panéliste
      'MODERATOR',      // Modérateur
      'PARTICIPANT',    // Participant
      'OBSERVER',       // Observateur
      'RAPPORTEUR'      // Rapporteur
    ),
    defaultValue: 'PARTICIPANT',
  },
  // Notes
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Référence investisseur (si c'est un investisseur enregistré)
  investorId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'investors', key: 'id' },
  },
  // Référence utilisateur (si c'est un utilisateur du système)
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
}, {
  tableName: 'dialogue_participants',
  timestamps: true,
  indexes: [
    { fields: ['dialogueId'] },
    { fields: ['participantType'] },
    { fields: ['invitationStatus'] },
    { fields: ['investorId'] },
  ],
});

export default DialogueParticipant;
