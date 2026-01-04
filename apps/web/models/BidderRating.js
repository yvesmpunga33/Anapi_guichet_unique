import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class BidderRating extends Model {}

BidderRating.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bidderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    contractId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Contrat associé à cette évaluation',
    },
    tenderId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    evaluationType: {
      type: DataTypes.ENUM('CONTRACT_COMPLETION', 'PERIODIC', 'INCIDENT', 'INITIAL'),
      defaultValue: 'PERIODIC',
    },
    evaluationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    evaluationPeriod: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Ex: Q1 2025, Contrat PM-2025-0001',
    },
    // Critères de notation (sur 5)
    qualityScore: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      comment: 'Qualité des livrables (1-5)',
      validate: { min: 0, max: 5 },
    },
    deliveryScore: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      comment: 'Respect des délais (1-5)',
      validate: { min: 0, max: 5 },
    },
    priceScore: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      comment: 'Rapport qualité/prix (1-5)',
      validate: { min: 0, max: 5 },
    },
    communicationScore: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      comment: 'Communication et réactivité (1-5)',
      validate: { min: 0, max: 5 },
    },
    complianceScore: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      comment: 'Conformité aux spécifications (1-5)',
      validate: { min: 0, max: 5 },
    },
    safetyScore: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      comment: 'Respect des normes de sécurité (1-5)',
      validate: { min: 0, max: 5 },
    },
    environmentalScore: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      comment: 'Respect de l\'environnement (1-5)',
      validate: { min: 0, max: 5 },
    },
    overallScore: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      comment: 'Score global calculé (1-5)',
    },
    // Poids des critères (optionnel, par défaut égal)
    criteriaWeights: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        quality: 20,
        delivery: 20,
        price: 15,
        communication: 15,
        compliance: 15,
        safety: 10,
        environmental: 5,
      },
    },
    // Incidents et pénalités
    incidentsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    penaltiesApplied: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    delaysCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalDelayDays: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Commentaires détaillés
    strengths: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    weaknesses: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    improvements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recommendation: {
      type: DataTypes.ENUM('HIGHLY_RECOMMENDED', 'RECOMMENDED', 'ACCEPTABLE', 'CONDITIONAL', 'NOT_RECOMMENDED'),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Validation
    status: {
      type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'),
      defaultValue: 'DRAFT',
    },
    evaluatedById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'bidder_ratings',
    modelName: 'BidderRating',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeSave: (rating) => {
        // Calculer le score global pondéré
        const weights = rating.criteriaWeights || {
          quality: 20,
          delivery: 20,
          price: 15,
          communication: 15,
          compliance: 15,
          safety: 10,
          environmental: 5,
        };

        const totalWeight =
          weights.quality +
          weights.delivery +
          weights.price +
          weights.communication +
          weights.compliance +
          weights.safety +
          weights.environmental;

        let weightedSum = 0;
        let appliedWeight = 0;

        if (rating.qualityScore) {
          weightedSum += parseFloat(rating.qualityScore) * weights.quality;
          appliedWeight += weights.quality;
        }
        if (rating.deliveryScore) {
          weightedSum += parseFloat(rating.deliveryScore) * weights.delivery;
          appliedWeight += weights.delivery;
        }
        if (rating.priceScore) {
          weightedSum += parseFloat(rating.priceScore) * weights.price;
          appliedWeight += weights.price;
        }
        if (rating.communicationScore) {
          weightedSum += parseFloat(rating.communicationScore) * weights.communication;
          appliedWeight += weights.communication;
        }
        if (rating.complianceScore) {
          weightedSum += parseFloat(rating.complianceScore) * weights.compliance;
          appliedWeight += weights.compliance;
        }
        if (rating.safetyScore) {
          weightedSum += parseFloat(rating.safetyScore) * weights.safety;
          appliedWeight += weights.safety;
        }
        if (rating.environmentalScore) {
          weightedSum += parseFloat(rating.environmentalScore) * weights.environmental;
          appliedWeight += weights.environmental;
        }

        if (appliedWeight > 0) {
          rating.overallScore = (weightedSum / appliedWeight).toFixed(2);
        }
      },
    },
  }
);

export default BidderRating;
