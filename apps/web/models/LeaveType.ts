import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface LeaveTypeAttributes {
  id: string;
  code: string;
  name: string;
  description: string | null;
  defaultDays: number;
  isPaid: boolean;
  requiresApproval: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LeaveTypeCreationAttributes extends Optional<LeaveTypeAttributes, 'id' | 'description' | 'defaultDays' | 'isPaid' | 'requiresApproval' | 'isActive'> {}

class LeaveType extends Model<LeaveTypeAttributes, LeaveTypeCreationAttributes> implements LeaveTypeAttributes {
  public id!: string;
  public code!: string;
  public name!: string;
  public description!: string | null;
  public defaultDays!: number;
  public isPaid!: boolean;
  public requiresApproval!: boolean;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LeaveType.init(
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
    defaultDays: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    requiresApproval: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'LeaveType',
    modelName: 'LeaveType',
    freezeTableName: true,
  }
);

export default LeaveType;
