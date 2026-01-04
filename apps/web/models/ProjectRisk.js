import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProjectRisk extends Model {}

ProjectRisk.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        'FINANCIAL',
        'TECHNICAL',
        'OPERATIONAL',
        'REGULATORY',
        'ENVIRONMENTAL',
        'SOCIAL',
        'POLITICAL',
        'MARKET',
        'SUPPLY_CHAIN',
        'SECURITY',
        'OTHER'
      ),
      defaultValue: 'OTHER',
    },
    probability: {
      type: DataTypes.ENUM('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'),
      defaultValue: 'MEDIUM',
    },
    impact: {
      type: DataTypes.ENUM('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'),
      defaultValue: 'MEDIUM',
    },
    riskScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Score calculé: probability * impact (1-25)',
    },
    riskLevel: {
      type: DataTypes.ENUM('LOW', 'MODERATE', 'HIGH', 'CRITICAL'),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'IDENTIFIED',
        'ASSESSED',
        'MITIGATING',
        'MONITORING',
        'RESOLVED',
        'ACCEPTED',
        'OCCURRED'
      ),
      defaultValue: 'IDENTIFIED',
    },
    mitigationStrategy: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Stratégie d\'atténuation du risque',
    },
    mitigationActions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Actions de mitigation [{action, responsible, deadline, status}]',
    },
    contingencyPlan: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Plan de contingence si le risque se réalise',
    },
    estimatedCost: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      comment: 'Coût estimé si le risque se réalise',
    },
    mitigationCost: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      comment: 'Coût des mesures de mitigation',
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
    },
    identifiedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    reviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextReviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resolvedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ownerName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Responsable du suivi du risque',
    },
    ownerContact: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    triggers: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Indicateurs de déclenchement du risque',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'project_risks',
    modelName: 'ProjectRisk',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeSave: (risk) => {
        // Calculer le score de risque
        const probabilityScore = { VERY_LOW: 1, LOW: 2, MEDIUM: 3, HIGH: 4, VERY_HIGH: 5 };
        const impactScore = { VERY_LOW: 1, LOW: 2, MEDIUM: 3, HIGH: 4, VERY_HIGH: 5 };

        const pScore = probabilityScore[risk.probability] || 3;
        const iScore = impactScore[risk.impact] || 3;
        risk.riskScore = pScore * iScore;

        // Déterminer le niveau de risque
        if (risk.riskScore <= 4) {
          risk.riskLevel = 'LOW';
        } else if (risk.riskScore <= 9) {
          risk.riskLevel = 'MODERATE';
        } else if (risk.riskScore <= 16) {
          risk.riskLevel = 'HIGH';
        } else {
          risk.riskLevel = 'CRITICAL';
        }
      },
    },
  }
);

export default ProjectRisk;
