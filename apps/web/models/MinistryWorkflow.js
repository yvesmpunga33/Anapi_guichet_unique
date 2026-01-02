import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class MinistryWorkflow extends Model {}

MinistryWorkflow.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ministryId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference vers le ministere',
    },
    requestType: {
      type: DataTypes.ENUM('AUTORISATION', 'LICENCE', 'PERMIS'),
      allowNull: false,
      comment: 'Type de demande',
    },
    stepNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Numero de l\'etape dans le workflow',
    },
    stepName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nom de l\'etape (ex: Reception, Verification, Validation)',
    },
    stepDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description detaillee de l\'etape',
    },
    responsibleRole: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Role responsable de cette etape',
    },
    estimatedDays: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
      comment: 'Duree estimee en jours',
    },
    requiredDocuments: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Liste des documents requis pour cette etape',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'ministry_workflows',
    modelName: 'MinistryWorkflow',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['ministryId', 'requestType', 'stepNumber'],
        name: 'ministry_workflow_unique_step',
      },
    ],
  }
);

export default MinistryWorkflow;
