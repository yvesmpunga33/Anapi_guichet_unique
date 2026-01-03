import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProjectHistory extends Model {}

ProjectHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference vers le projet Investment',
    },
    action: {
      type: DataTypes.ENUM(
        'CREATED',
        'UPDATED',
        'STATUS_CHANGED',
        'DOCUMENT_UPLOADED',
        'DOCUMENT_DELETED',
        'INVESTOR_CHANGED',
        'AMOUNT_UPDATED',
        'APPROVED',
        'REJECTED',
        'STARTED',
        'COMPLETED',
        'CANCELLED',
        'COMMENT_ADDED',
        'MILESTONE_REACHED'
      ),
      allowNull: false,
    },
    previousStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    newStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fieldChanged: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Nom du champ modifie',
    },
    previousValue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    newValue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description de laction',
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
      comment: 'Donnees additionnelles (document info, etc.)',
    },
    performedById: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    performedByName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'project_history',
    modelName: 'ProjectHistory',
    timestamps: true,
    updatedAt: false,
  }
);

export default ProjectHistory;
