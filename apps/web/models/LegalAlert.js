import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class LegalAlert extends Model {}

LegalAlert.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    alertNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Numero unique (ALERT-2025-00001)',
    },
    type: {
      type: DataTypes.ENUM(
        'CONTRACT_EXPIRATION',
        'CONTRACT_RENEWAL',
        'DOCUMENT_REVIEW',
        'LAW_MODIFICATION',
        'DEADLINE',
        'CUSTOM'
      ),
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      defaultValue: 'MEDIUM',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Dates
    triggerDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date de declenchement',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date limite',
    },
    // Relations
    contractId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Reference vers Contract',
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Reference vers JuridicalText',
    },
    // Affectation
    assignedToId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notifiedUsers: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'IDs utilisateurs notifies',
    },
    // Statut
    status: {
      type: DataTypes.ENUM(
        'PENDING',
        'NOTIFIED',
        'ACKNOWLEDGED',
        'IN_PROGRESS',
        'RESOLVED',
        'DISMISSED'
      ),
      defaultValue: 'PENDING',
    },
    // Actions
    actions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Historique des actions [{date, userId, action, note}]',
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resolvedById: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resolutionNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'legal_alerts',
    modelName: 'LegalAlert',
    timestamps: true,
  }
);

export default LegalAlert;
