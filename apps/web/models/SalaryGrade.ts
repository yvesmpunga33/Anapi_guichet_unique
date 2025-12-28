import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface SalaryGradeAttributes {
  id: string;
  code: string;
  name: string;
  description: string | null;
  minSalary: number;
  maxSalary: number;
  currency: string;
  level: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SalaryGradeCreationAttributes extends Optional<SalaryGradeAttributes, 'id' | 'description' | 'currency' | 'level' | 'isActive'> {}

class SalaryGrade extends Model<SalaryGradeAttributes, SalaryGradeCreationAttributes> implements SalaryGradeAttributes {
  public id!: string;
  public code!: string;
  public name!: string;
  public description!: string | null;
  public minSalary!: number;
  public maxSalary!: number;
  public currency!: string;
  public level!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SalaryGrade.init(
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
    minSalary: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    maxSalary: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'CDF',
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'SalaryGrade',
    modelName: 'SalaryGrade',
    freezeTableName: true,
  }
);

export default SalaryGrade;
