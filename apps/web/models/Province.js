import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const Province = sequelize.define('Province', {
  id: {
    type: DataTypes.TEXT,
    primaryKey: true,
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  capital: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  population: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  area: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'Province',
  timestamps: true,
});

export default Province;
