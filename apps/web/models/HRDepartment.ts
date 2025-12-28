import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface HRDepartmentAttributes {
  id: string;
  code: string;
  name: string;
  description: string | null;
  parentId: string | null;
  managerId: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface HRDepartmentCreationAttributes extends Optional<HRDepartmentAttributes, 'id' | 'description' | 'parentId' | 'managerId' | 'isActive'> {}

class HRDepartment extends Model<HRDepartmentAttributes, HRDepartmentCreationAttributes> implements HRDepartmentAttributes {
  public id!: string;
  public code!: string;
  public name!: string;
  public description!: string | null;
  public parentId!: string | null;
  public managerId!: string | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public parent?: HRDepartment;
  public children?: HRDepartment[];
}

HRDepartment.init(
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
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    managerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'HRDepartment',
    modelName: 'HRDepartment',
    freezeTableName: true,
  }
);

export default HRDepartment;
