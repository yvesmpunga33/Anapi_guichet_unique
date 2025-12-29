import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class WorkerCategory extends Model {}

WorkerCategory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    baseSalary: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'CDF',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'WorkerCategory',
    modelName: 'WorkerCategory',
    freezeTableName: true,
  }
);

export default WorkerCategory;
