import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class Dossier extends Model {}

Dossier.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    dossierNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Numero unique du dossier (DOS-2024-00001)',
    },
    dossierType: {
      type: DataTypes.ENUM(
        'AGREMENT_REGIME',
        'DECLARATION_INVESTISSEMENT',
        'DEMANDE_TERRAIN',
        'LICENCE_EXPLOITATION'
      ),
      allowNull: false,
    },
    // Investor information (can be linked to existing investor or new)
    investorId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Reference vers un investisseur existant',
    },
    investorType: {
      type: DataTypes.ENUM('company', 'individual'),
      defaultValue: 'company',
    },
    investorName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    investorEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    investorPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    investorProvince: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    investorProvinceId: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reference vers la province de l\'investisseur',
    },
    investorCity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    investorCityId: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reference vers la ville de l\'investisseur',
    },
    investorCommune: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    investorCommuneId: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reference vers la commune de l\'investisseur',
    },
    investorAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    investorCountry: {
      type: DataTypes.STRING,
      defaultValue: 'RDC',
    },
    // Project information
    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subSector: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectProvince: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectProvinceId: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reference vers la province du projet',
    },
    projectCity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectCityId: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reference vers la ville du projet',
    },
    projectCommune: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectCommuneId: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reference vers la commune du projet',
    },
    projectAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Financial information
    investmentAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    directJobs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Nombre d\'emplois directs a creer',
    },
    indirectJobs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Nombre d\'emplois indirects a creer',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Workflow status
    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'SUBMITTED',
        'IN_REVIEW',
        'PENDING_DOCUMENTS',
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
    // Assignment
    assignedToId: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'ID de l\'utilisateur assigne (format cuid ou uuid)',
    },
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Dates
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewedAt: {
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
    // Ministry responsible
    ministryId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID du ministère responsable',
    },
    // Created by
    createdById: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'ID de l\'utilisateur createur (format cuid ou uuid)',
    },
  },
  {
    sequelize,
    tableName: 'dossiers',
    modelName: 'Dossier',
    timestamps: true,
  }
);

export default Dossier;
