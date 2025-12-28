import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface InvestmentAttributes {
  id: string;
  projectCode: string;
  projectName: string;
  description: string | null;
  investorId: string;
  sector: string;
  subSector: string | null;
  province: string;
  city: string | null;
  address: string | null;
  amount: number;
  currency: string;
  jobsCreated: number;
  jobsIndirect: number;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  progress: number;
  approvalDate: Date | null;
  approvedBy: string | null;
  rejectionDate: Date | null;
  rejectedBy: string | null;
  rejectionReason: string | null;
  createdById: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface InvestmentCreationAttributes extends Optional<InvestmentAttributes, 'id' | 'description' | 'subSector' | 'city' | 'address' | 'currency' | 'jobsCreated' | 'jobsIndirect' | 'startDate' | 'endDate' | 'status' | 'progress' | 'approvalDate' | 'approvedBy' | 'rejectionDate' | 'rejectedBy' | 'rejectionReason' | 'createdById'> {}

class Investment extends Model<InvestmentAttributes, InvestmentCreationAttributes> implements InvestmentAttributes {
  public id!: string;
  public projectCode!: string;
  public projectName!: string;
  public description!: string | null;
  public investorId!: string;
  public sector!: string;
  public subSector!: string | null;
  public province!: string;
  public city!: string | null;
  public address!: string | null;
  public amount!: number;
  public currency!: string;
  public jobsCreated!: number;
  public jobsIndirect!: number;
  public startDate!: Date | null;
  public endDate!: Date | null;
  public status!: string;
  public progress!: number;
  public approvalDate!: Date | null;
  public approvedBy!: string | null;
  public rejectionDate!: Date | null;
  public rejectedBy!: string | null;
  public rejectionReason!: string | null;
  public createdById!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association
  public investor?: any;
}

Investment.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    projectCode: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    projectName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    investorId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sector: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subSector: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    province: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.TEXT,
      defaultValue: 'USD',
    },
    jobsCreated: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    jobsIndirect: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'DRAFT',
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approvedBy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rejectionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejectedBy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Investment',
    modelName: 'Investment',
    freezeTableName: true,
  }
);

export default Investment;
