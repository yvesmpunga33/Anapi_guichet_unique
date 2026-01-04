import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProjectImpact extends Model {}

ProjectImpact.init(
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
    reportDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    reportPeriod: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Ex: Q1 2025, Année 2024',
    },
    // Emplois
    directJobsPlanned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    directJobsCreated: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    indirectJobsPlanned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    indirectJobsCreated: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    permanentJobs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    temporaryJobs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    localJobs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Emplois pour les résidents locaux',
    },
    femaleJobs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    youthJobs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Emplois pour les jeunes (18-35 ans)',
    },
    // Revenus et finances
    projectedRevenue: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    actualRevenue: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    taxesPaid: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    localPurchases: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
      comment: 'Achats auprès de fournisseurs locaux',
    },
    exportRevenue: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
    },
    // Formation et développement
    trainedEmployees: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    trainingHours: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    trainingInvestment: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    // Impact social
    communityInvestment: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
      comment: 'Investissements communautaires (écoles, hôpitaux, etc.)',
    },
    infrastructureBuilt: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Infrastructures construites [{type, description, value}]',
    },
    beneficiaries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Nombre de bénéficiaires directs dans la communauté',
    },
    // Impact environnemental
    carbonFootprint: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Empreinte carbone en tonnes CO2',
    },
    renewableEnergyPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    wasteRecycledPercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    waterUsage: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      comment: 'Consommation d\'eau en m³',
    },
    environmentalMeasures: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Mesures environnementales [{measure, status, impact}]',
    },
    // Transfert de technologie
    technologyTransfers: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Technologies transférées [{name, description, beneficiaries}]',
    },
    patentsRegistered: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    localPartnerships: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Notes et commentaires
    achievements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    challenges: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nextSteps: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Validation
    status: {
      type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'VERIFIED', 'APPROVED', 'REJECTED'),
      defaultValue: 'DRAFT',
    },
    verifiedById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'project_impacts',
    modelName: 'ProjectImpact',
    timestamps: true,
    underscored: true,
  }
);

export default ProjectImpact;
