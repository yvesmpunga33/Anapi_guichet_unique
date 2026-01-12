import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProvinceInfrastructure extends Model {}

ProvinceInfrastructure.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    provinceId: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'province_id',
      references: {
        model: 'provinces',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('ROUTE', 'PONT', 'AEROPORT', 'PORT', 'GARE', 'BARRAGE', 'CENTRALE_ELECTRIQUE', 'RESEAU_EAU', 'RESEAU_TELECOM', 'BATIMENT_PUBLIC', 'AUTRE'),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('EXISTANT', 'EN_CONSTRUCTION', 'PLANIFIE', 'A_REHABILITER'),
      defaultValue: 'EXISTANT',
    },
    status: {
      type: DataTypes.ENUM('OPERATIONNEL', 'EN_TRAVAUX', 'HORS_SERVICE', 'PROJET'),
      defaultValue: 'OPERATIONNEL',
    },
    // Localisation
    startLocation: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'start_location',
      comment: 'Point de depart (pour routes)',
    },
    endLocation: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'end_location',
      comment: 'Point d\'arrivee (pour routes)',
    },
    coordinates: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Coordonnees GPS {lat, lng} ou polyline pour routes',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Caracteristiques
    length: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Longueur en km',
    },
    width: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Largeur en metres',
    },
    capacity: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Capacite (ex: tonnes pour pont, MW pour centrale)',
    },
    constructionYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'construction_year',
    },
    lastRenovationYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'last_renovation_year',
    },
    // Financement
    budget: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    fundingSource: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'funding_source',
      comment: 'Source de financement',
    },
    contractor: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Entreprise executante',
    },
    // Dates projet
    projectStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'project_start_date',
    },
    expectedCompletionDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expected_completion_date',
    },
    actualCompletionDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'actual_completion_date',
    },
    progressPercent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'progress_percent',
      comment: 'Pourcentage d\'avancement',
    },
    // Media
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'cover_image',
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    documents: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Documents associes [{name, url, type}]',
    },
    // Meta
    importance: {
      type: DataTypes.ENUM('NATIONALE', 'PROVINCIALE', 'LOCALE'),
      defaultValue: 'PROVINCIALE',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_featured',
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_published',
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by_id',
    },
  },
  {
    sequelize,
    tableName: 'province_infrastructure',
    modelName: 'ProvinceInfrastructure',
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['province_id'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['is_published'],
      },
    ],
  }
);

export default ProvinceInfrastructure;
