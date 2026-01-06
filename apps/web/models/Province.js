import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const Province = sequelize.define('Province', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameFr: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'name_fr',
  },
  nameEn: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'name_en',
  },
  capital: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  population: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  area: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  tableName: 'provinces',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Province;
