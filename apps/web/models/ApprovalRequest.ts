import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface ApprovalRequestAttributes {
  id: string;
  requestNumber: string;
  investorId: string;
  investmentId: string | null;
  approvalType: string;
  regime: string | null;
  projectName: string;
  projectDescription: string | null;
  investmentAmount: number;
  currency: string;
  jobsToCreate: number;
  province: string;
  sector: string;
  status: string;
  currentStep: number;
  assignedToId: string | null;
  assignedAt: Date | null;
  decisionDate: Date | null;
  decisionNote: string | null;
  submittedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ApprovalRequestCreationAttributes extends Optional<ApprovalRequestAttributes, 'id' | 'investmentId' | 'regime' | 'projectDescription' | 'currency' | 'jobsToCreate' | 'status' | 'currentStep' | 'assignedToId' | 'assignedAt' | 'decisionDate' | 'decisionNote' | 'submittedAt'> {}

class ApprovalRequest extends Model<ApprovalRequestAttributes, ApprovalRequestCreationAttributes> implements ApprovalRequestAttributes {
  public id!: string;
  public requestNumber!: string;
  public investorId!: string;
  public investmentId!: string | null;
  public approvalType!: string;
  public regime!: string | null;
  public projectName!: string;
  public projectDescription!: string | null;
  public investmentAmount!: number;
  public currency!: string;
  public jobsToCreate!: number;
  public province!: string;
  public sector!: string;
  public status!: string;
  public currentStep!: number;
  public assignedToId!: string | null;
  public assignedAt!: Date | null;
  public decisionDate!: Date | null;
  public decisionNote!: string | null;
  public submittedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ApprovalRequest.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    requestNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    investorId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    investmentId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approvalType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    regime: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    projectName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    projectDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    investmentAmount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.TEXT,
      defaultValue: 'USD',
    },
    jobsToCreate: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    province: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sector: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'DRAFT',
    },
    currentStep: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    assignedToId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    decisionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    decisionNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'ApprovalRequest',
    modelName: 'ApprovalRequest',
    freezeTableName: true,
  }
);

export default ApprovalRequest;
