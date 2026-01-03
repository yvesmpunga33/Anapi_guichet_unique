import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProcurementContract extends Model {}

ProcurementContract.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    bidId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    bidderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    lotId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    contractNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contractValue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
    },
    signatureDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveryDeadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveryLocation: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'PENDING_SIGNATURE',
        'SIGNED',
        'ACTIVE',
        'SUSPENDED',
        'COMPLETED',
        'TERMINATED',
        'CANCELLED'
      ),
      defaultValue: 'DRAFT',
    },
    performanceGuarantee: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    guaranteeReference: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    guaranteeExpiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    advancePayment: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    advancePaymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    retentionPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    paymentTerms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    penaltyClause: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    penaltyPercentagePerDay: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    maxPenaltyPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    totalPenaltyApplied: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    progressPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    totalPaid: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    remainingAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    receptionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    finalReceptionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    terminationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    terminationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ministryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    managedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    signedByClientId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    signedByContractorName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    signedByContractorTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    archivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    certificateNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    certificateIssuedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    certificateIssuedById: {
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
    tableName: 'procurement_contracts',
    modelName: 'ProcurementContract',
    timestamps: true,
    underscored: true,
  }
);

export default ProcurementContract;
