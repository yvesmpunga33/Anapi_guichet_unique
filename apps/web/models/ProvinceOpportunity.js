import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProvinceOpportunity extends Model {}

ProvinceOpportunity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reference: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Reference unique de l\'opportunite (ex: OPP-2026-001)',
    },
    title: {
      type: DataTypes.STRING(300),
      allowNull: false,
      comment: 'Titre du projet d\'investissement',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description detaillee du projet',
    },
    provinceId: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'Province',
        key: 'id',
      },
      comment: 'Province qui propose l\'opportunite',
    },
    sectorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'sectors',
        key: 'id',
      },
      comment: 'Secteur d\'activite',
    },
    minInvestment: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
      comment: 'Montant minimum d\'investissement requis (USD)',
    },
    maxInvestment: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
      comment: 'Montant maximum d\'investissement (USD)',
    },
    expectedJobs: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Nombre d\'emplois prevus',
    },
    projectDuration: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Duree estimee du projet',
    },
    location: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Localisation precise du projet',
    },
    advantages: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Avantages et incitations offerts (JSON array)',
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Exigences pour les investisseurs (JSON array)',
    },
    contactName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Nom du contact',
    },
    contactEmail: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Email de contact',
    },
    contactPhone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Telephone de contact',
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date limite de candidature',
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'),
      allowNull: false,
      defaultValue: 'DRAFT',
      comment: 'Statut de l\'opportunite',
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
      allowNull: false,
      defaultValue: 'MEDIUM',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Opportunite mise en avant',
    },
    viewsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Nombre de vues',
    },
    applicationsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Nombre de candidatures recues',
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Image de presentation',
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date de publication',
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date de cloture',
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Utilisateur qui a cree l\'opportunite',
    },
  },
  {
    sequelize,
    tableName: 'province_opportunities',
    modelName: 'ProvinceOpportunity',
    timestamps: true,
    indexes: [
      { fields: ['reference'], unique: true },
      { fields: ['provinceId'] },
      { fields: ['sectorId'] },
      { fields: ['status'] },
      { fields: ['isFeatured'] },
      { fields: ['deadline'] },
      { fields: ['createdAt'] },
    ],
  }
);

export default ProvinceOpportunity;
