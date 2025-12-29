import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ApprovalRequest extends Model {}

ApprovalRequest.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    requestNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    investorId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    investmentId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approvalType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    regime: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    projectName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    projectDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    investmentAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.TEXT,
      defaultValue: 'USD',
    },
    jobsToCreate: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    directJobs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Nombre d\'emplois directs à créer',
    },
    indirectJobs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Nombre d\'emplois indirects à créer',
    },
    province: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sector: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'DRAFT',
    },
    currentStep: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    assignedToId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    decisionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    decisionNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'ApprovalRequest',
    modelName: 'ApprovalRequest',
    freezeTableName: true,
  }
);

export default ApprovalRequest;
