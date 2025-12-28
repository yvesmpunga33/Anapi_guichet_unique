import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface WorkerCategoryAttributes {
  id: string;
  code: string;
  name: string;
  description: string | null;
  baseSalary: number;
  currency: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WorkerCategoryCreationAttributes extends Optional<WorkerCategoryAttributes, 'id' | 'description' | 'baseSalary' | 'currency' | 'isActive'> {}

class WorkerCategory extends Model<WorkerCategoryAttributes, WorkerCategoryCreationAttributes> implements WorkerCategoryAttributes {
  public id!: string;
  public code!: string;
  public name!: string;
  public description!: string | null;
  public baseSalary!: number;
  public currency!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
