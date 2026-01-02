import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const DossierStepValidation = sequelize.define('DossierStepValidation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  dossierId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'dossiers',
      key: 'id',
    },
  },
  stepNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stepName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  validatedById: {
    type: DataTypes.TEXT,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  validatedByName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  validatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('VALIDATED', 'REJECTED', 'PENDING'),
    defaultValue: 'VALIDATED',
  },
}, {
  tableName: 'dossier_step_validations',
  timestamps: true,
  underscored: true,
});

export default DossierStepValidation;
