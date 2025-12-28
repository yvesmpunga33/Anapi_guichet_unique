import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface LeaveAttributes {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string | null;
  status: string;
  approvedById: string | null;
  approvedAt: Date | null;
  rejectionReason: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LeaveCreationAttributes extends Optional<LeaveAttributes, 'id' | 'totalDays' | 'reason' | 'status' | 'approvedById' | 'approvedAt' | 'rejectionReason'> {}

class Leave extends Model<LeaveAttributes, LeaveCreationAttributes> implements LeaveAttributes {
  public id!: string;
  public employeeId!: string;
  public leaveTypeId!: string;
  public startDate!: Date;
  public endDate!: Date;
  public totalDays!: number;
  public reason!: string | null;
  public status!: string;
  public approvedById!: string | null;
  public approvedAt!: Date | null;
  public rejectionReason!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Leave.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    leaveTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalDays: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'PENDING',
    },
    approvedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Leave',
    modelName: 'Leave',
    freezeTableName: true,
  }
);

export default Leave;
