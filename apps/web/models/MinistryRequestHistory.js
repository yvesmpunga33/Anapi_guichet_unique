import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class MinistryRequestHistory extends Model {}

MinistryRequestHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    requestId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference vers la demande',
    },
    stepNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stepName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM(
        'CREATED',
        'SUBMITTED',
        'ASSIGNED',
        'STEP_COMPLETED',
        'DOCUMENTS_REQUESTED',
        'DOCUMENTS_RECEIVED',
        'APPROVED',
        'REJECTED',
        'ON_HOLD',
        'CANCELLED',
        'COMMENT_ADDED',
        'CONTACT_APPLICANT'
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
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    performedById: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    performedByName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'ministry_request_history',
    modelName: 'MinistryRequestHistory',
    timestamps: true,
    updatedAt: false,
  }
);

export default MinistryRequestHistory;
