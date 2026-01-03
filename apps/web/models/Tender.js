import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class Tender extends Model {}

Tender.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reference: {
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
    objective: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    productsOrServices: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('OPEN', 'RESTRICTED', 'NEGOTIATED', 'DIRECT', 'FRAMEWORK'),
      defaultValue: 'OPEN',
    },
    category: {
      type: DataTypes.ENUM('WORKS', 'GOODS', 'SERVICES', 'CONSULTING'),
      defaultValue: 'GOODS',
    },
    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'PENDING_APPROVAL',
        'PUBLISHED',
        'SUBMISSION_CLOSED',
        'EVALUATION',
        'AWARDED',
        'CANCELLED',
        'COMPLETED'
      ),
      defaultValue: 'DRAFT',
    },
    estimatedBudget: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
    },
    minimumBudget: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    maximumBudget: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    publishDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    submissionDeadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    openingDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    evaluationStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    evaluationEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    awardDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    contractStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    contractEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveryDeadline: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deliveryUnit: {
      type: DataTypes.ENUM('DAYS', 'WEEKS', 'MONTHS'),
      defaultValue: 'DAYS',
    },
    deliveryLocation: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    technicalCriteriaWeight: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 70.00,
    },
    financialCriteriaWeight: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 30.00,
    },
    minimumTechnicalScore: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 70.00,
    },
    eligibilityCriteria: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    technicalCriteria: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    financialCriteria: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    guaranteeRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    guaranteePercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    guaranteeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ministryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.UUID,
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
    approvalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancelledById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    cancellationDate: {
      type: DataTypes.DATE,
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
    archivedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    fiscalYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    budgetLine: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    fundingSource: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contactName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'procurement_tenders',
    modelName: 'Tender',
    timestamps: true,
    underscored: true,
  }
);

export default Tender;
