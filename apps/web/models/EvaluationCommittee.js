import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class EvaluationCommittee extends Model {}

EvaluationCommittee.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('PRESIDENT', 'MEMBER', 'SECRETARY', 'OBSERVER', 'EXPERT'),
      defaultValue: 'MEMBER',
    },
    specialization: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    canEvaluateTechnical: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    canEvaluateFinancial: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    hasVotingRight: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    nominatedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    nominationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'RECUSED'),
      defaultValue: 'ACTIVE',
    },
    recusedReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'procurement_evaluation_committees',
    modelName: 'EvaluationCommittee',
    timestamps: true,
    underscored: true,
  }
);

export default EvaluationCommittee;
