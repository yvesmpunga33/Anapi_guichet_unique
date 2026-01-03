import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class Bid extends Model {}

Bid.init(
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
    bidderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    lotId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    reference: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    submissionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    financialOffer: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
    },
    technicalProposal: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deliveryTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    deliveryUnit: {
      type: DataTypes.ENUM('DAYS', 'WEEKS', 'MONTHS'),
      defaultValue: 'DAYS',
    },
    validityPeriod: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    guaranteeProvided: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    guaranteeAmount: {
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
    status: {
      type: DataTypes.ENUM(
        'RECEIVED',
        'ADMINISTRATIVE_CHECK',
        'TECHNICAL_EVALUATION',
        'FINANCIAL_EVALUATION',
        'EVALUATED',
        'SELECTED',
        'AWARDED',
        'REJECTED',
        'DISQUALIFIED',
        'WITHDRAWN'
      ),
      defaultValue: 'RECEIVED',
    },
    administrativeScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    administrativeStatus: {
      type: DataTypes.ENUM('PENDING', 'COMPLIANT', 'NON_COMPLIANT'),
      defaultValue: 'PENDING',
    },
    administrativeNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    technicalScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    technicalDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    technicalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    financialScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    financialDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    financialNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    totalScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    ranking: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    disqualificationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    evaluatedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    evaluationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    receivedById: {
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
    tableName: 'procurement_bids',
    modelName: 'Bid',
    timestamps: true,
    underscored: true,
  }
);

export default Bid;
