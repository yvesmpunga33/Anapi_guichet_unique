import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class MinistryDepartment extends Model {}

MinistryDepartment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
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
    ministryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ministries',
        key: 'id',
      },
    },
    headName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Nom du responsable du département',
    },
    headTitle: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Titre du responsable (Directeur, Chef de service, etc.)',
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'ministry_departments',
    modelName: 'MinistryDepartment',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['ministry_id'] },
      { fields: ['code', 'ministry_id'], unique: true },
      { fields: ['is_active'] },
    ],
  }
);

export default MinistryDepartment;
