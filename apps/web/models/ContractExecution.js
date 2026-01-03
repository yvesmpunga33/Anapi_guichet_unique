import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ContractExecution extends Model {}

ContractExecution.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    contractId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    phase: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('MILESTONE', 'DELIVERY', 'PAYMENT', 'INSPECTION', 'AMENDMENT', 'PENALTY', 'OTHER'),
      defaultValue: 'MILESTONE',
    },
    plannedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actualDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED'),
      defaultValue: 'PLANNED',
    },
    progressPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    quantityPlanned: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    quantityDelivered: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    amountPlanned: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    amountPaid: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paymentReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    penaltyAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    penaltyReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    delayDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    qualityScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    qualityNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    inspectionReport: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    inspectedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    inspectionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approvedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'procurement_contract_executions',
    modelName: 'ContractExecution',
    timestamps: true,
    underscored: true,
  }
);

export default ContractExecution;
