import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProjectMilestone extends Model {}

ProjectMilestone.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        'PLANNING',
        'DESIGN',
        'PROCUREMENT',
        'CONSTRUCTION',
        'INSTALLATION',
        'TESTING',
        'TRAINING',
        'LAUNCH',
        'OPERATIONAL',
        'OTHER'
      ),
      defaultValue: 'OTHER',
    },
    plannedStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    plannedEndDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    actualStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actualEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'NOT_STARTED',
        'IN_PROGRESS',
        'COMPLETED',
        'DELAYED',
        'ON_HOLD',
        'CANCELLED'
      ),
      defaultValue: 'NOT_STARTED',
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    budget: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    actualCost: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
      comment: 'Poids du jalon dans le calcul de progression globale (en %)',
    },
    deliverables: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Liste des livrables attendus [{name, description, status}]',
    },
    dependencies: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'IDs des jalons prérequis',
    },
    responsibleName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    responsibleContact: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    completedById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    completedAt: {
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
    tableName: 'project_milestones',
    modelName: 'ProjectMilestone',
    timestamps: true,
    underscored: true,
  }
);

export default ProjectMilestone;
