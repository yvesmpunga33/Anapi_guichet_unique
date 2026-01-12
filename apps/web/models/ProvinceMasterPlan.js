import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProvinceMasterPlan extends Model {}

ProvinceMasterPlan.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    vision: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Vision strategique',
    },
    objectives: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Objectifs du plan [{title, description, target}]',
    },
    sector: {
      type: DataTypes.ENUM('URBANISME', 'TRANSPORT', 'ENERGIE', 'EAU', 'AGRICULTURE', 'INDUSTRIE', 'TOURISME', 'ENVIRONNEMENT', 'NUMERIQUE', 'GLOBAL'),
      defaultValue: 'GLOBAL',
    },
    horizon: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Horizon temporel (ex: 2030, 2050)',
    },
    startYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'start_year',
    },
    endYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'end_year',
    },
    totalBudget: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
      field: 'total_budget',
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    phases: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Phases du plan [{name, startYear, endYear, budget, objectives}]',
    },
    keyProjects: {
      type: DataTypes.JSONB,
      defaultValue: [],
      field: 'key_projects',
      comment: 'Projets cles [{name, description, budget, timeline, status}]',
    },
    stakeholders: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Parties prenantes [{name, role, contact}]',
    },
    kpis: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Indicateurs de performance [{name, baseline, target, current}]',
    },
    risks: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Risques identifies [{description, probability, impact, mitigation}]',
    },
    // Documents
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'cover_image',
    },
    mapImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'map_image',
      comment: 'Carte du plan directeur',
    },
    documents: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Documents du plan [{name, url, type}]',
    },
    // Status
    status: {
      type: DataTypes.ENUM('DRAFT', 'EN_CONSULTATION', 'APPROUVE', 'EN_EXECUTION', 'TERMINE', 'REVISE'),
      defaultValue: 'DRAFT',
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'approval_date',
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'approved_by',
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_published',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_featured',
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by_id',
    },
  },
  {
    sequelize,
    tableName: 'province_master_plans',
    modelName: 'ProvinceMasterPlan',
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
        fields: ['sector'],
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

export default ProvinceMasterPlan;
