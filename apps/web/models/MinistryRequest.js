import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class MinistryRequest extends Model {}

MinistryRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    requestNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Numero unique (AUT-2025-00001, LIC-2025-00001, PER-2025-00001)',
    },
    requestType: {
      type: DataTypes.ENUM('AUTORISATION', 'LICENCE', 'PERMIS'),
      allowNull: false,
    },
    ministryId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Ministere de tutelle',
    },
    // Demandeur
    applicantType: {
      type: DataTypes.ENUM('INVESTOR', 'COMPANY', 'INDIVIDUAL'),
      defaultValue: 'COMPANY',
    },
    applicantName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    applicantEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    applicantPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    applicantAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rccm: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idNat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nif: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Details de la demande
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Objet de la demande',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Montants
    investmentAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    // Workflow status
    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'SUBMITTED',
        'IN_PROGRESS',
        'PENDING_DOCUMENTS',
        'UNDER_REVIEW',
        'APPROVED',
        'REJECTED',
        'CANCELLED'
      ),
      defaultValue: 'DRAFT',
    },
    currentStep: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    totalSteps: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT'),
      defaultValue: 'NORMAL',
    },
    // Traitement
    assignedToId: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Agent traitant du ministere',
    },
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Dates importantes
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastStepAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date du dernier changement d\'etape',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date limite de traitement',
    },
    decisionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    decisionNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Reference
    dossierId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Reference vers le dossier ANAPI si applicable',
    },
    investorId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'ministry_requests',
    modelName: 'MinistryRequest',
    timestamps: true,
  }
);

export default MinistryRequest;
