import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const City = sequelize.define('City', {
  id: {
    type: DataTypes.TEXT,
    primaryKey: true,
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  provinceId: {
    type: DataTypes.TEXT,
    allowNull: false,
    references: {
      model: 'Province',
      key: 'id',
    },
  },
  population: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isCapital: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'City',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['code', 'provinceId'],
    },
  ],
});

export default City;
