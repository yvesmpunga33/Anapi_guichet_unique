import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const Commune = sequelize.define('Commune', {
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
  cityId: {
    type: DataTypes.TEXT,
    allowNull: false,
    references: {
      model: 'City',
      key: 'id',
    },
  },
  population: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'Commune',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['code', 'cityId'],
    },
  ],
});

export default Commune;
