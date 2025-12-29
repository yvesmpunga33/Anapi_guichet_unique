import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class LeaveType extends Model {}

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
