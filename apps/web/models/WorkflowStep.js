import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class WorkflowStep extends Model {}

WorkflowStep.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Type de workflow (AGREMENT, DOSSIER, INVESTMENT, etc.)
    workflowType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'AGREMENT',
    },
    // Numero d'ordre de l'etape
    stepNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Nom de l'etape
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Description de l'etape
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Icone (nom de l'icone lucide)
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Circle',
    },
    // Couleur de l'etape
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '#3B82F6',
    },
    // Duree estimee en jours
    estimatedDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 7,
    },
    // Documents requis pour cette etape
    requiredDocuments: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    // Actions disponibles a cette etape
    availableActions: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: ['approve', 'reject', 'request_info'],
    },
    // Role/Departement responsable
    responsibleRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Est-ce une etape finale?
    isFinal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Est-ce une etape obligatoire?
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Etape active ou non
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'workflow_steps',
    modelName: 'WorkflowStep',
    timestamps: true,
    indexes: [
      {
        fields: ['workflowType', 'stepNumber'],
        unique: true,
      },
      {
        fields: ['workflowType', 'isActive'],
      },
    ],
  }
);

export default WorkflowStep;
