import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('NORMAL', 'HIGH', 'URGENT'),
    defaultValue: 'NORMAL',
  },
  senderId: {
    type: DataTypes.TEXT,
    allowNull: true, // Peut etre null pour les emails externes recus
    references: {
      model: 'User',
      key: 'id',
    },
  },
  // Type de message: interne ou externe
  messageType: {
    type: DataTypes.ENUM('INTERNAL', 'EXTERNAL_OUT', 'EXTERNAL_IN'),
    defaultValue: 'INTERNAL',
    comment: 'INTERNAL: message interne, EXTERNAL_OUT: email envoye, EXTERNAL_IN: email recu',
  },
  // Pour les emails externes
  externalFrom: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Email expediteur externe',
  },
  externalTo: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Emails destinataires externes (JSON array)',
  },
  externalCc: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Emails CC externes (JSON array)',
  },
  externalMessageId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Message-ID de l\'email (pour eviter les doublons)',
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date d\'envoi effectif de l\'email',
  },
  sendStatus: {
    type: DataTypes.ENUM('PENDING', 'SENT', 'FAILED'),
    defaultValue: 'PENDING',
    comment: 'Statut d\'envoi pour les emails externes',
  },
  sendError: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Message d\'erreur si l\'envoi a echoue',
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'messages',
  timestamps: true,
  underscored: true,
});

export default Message;
