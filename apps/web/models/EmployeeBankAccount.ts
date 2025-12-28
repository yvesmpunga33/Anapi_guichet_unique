import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface EmployeeBankAccountAttributes {
  id: string;
  employeeId: string;
  accountType: 'bank' | 'mobile_money';
  // Bank information
  bankName: string;
  bankCode: string | null;
  branchName: string | null;
  branchCode: string | null;
  bankAddress: string | null;
  // Account numbers
  accountNumber: string;
  iban: string | null;
  swiftCode: string | null;
  routingNumber: string | null;
  // Account holder
  accountHolderName: string;
  accountCategory: 'current' | 'savings' | 'other';
  // Mobile money (if accountType = 'mobile_money')
  mobileOperator: string | null;
  mobileNumber: string | null;
  // Currency & options
  currency: string;
  isDefault: boolean;
  isActive: boolean;
  purpose: string | null;
  // Documents
  ribDocumentUrl: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmployeeBankAccountCreationAttributes extends Optional<EmployeeBankAccountAttributes,
  'id' | 'bankCode' | 'branchName' | 'branchCode' | 'bankAddress' | 'iban' | 'swiftCode' |
  'routingNumber' | 'accountCategory' | 'mobileOperator' | 'mobileNumber' | 'isDefault' |
  'isActive' | 'purpose' | 'ribDocumentUrl'> {}

class EmployeeBankAccount extends Model<EmployeeBankAccountAttributes, EmployeeBankAccountCreationAttributes> implements EmployeeBankAccountAttributes {
  public id!: string;
  public employeeId!: string;
  public accountType!: 'bank' | 'mobile_money';
  public bankName!: string;
  public bankCode!: string | null;
  public branchName!: string | null;
  public branchCode!: string | null;
  public bankAddress!: string | null;
  public accountNumber!: string;
  public iban!: string | null;
  public swiftCode!: string | null;
  public routingNumber!: string | null;
  public accountHolderName!: string;
  public accountCategory!: 'current' | 'savings' | 'other';
  public mobileOperator!: string | null;
  public mobileNumber!: string | null;
  public currency!: string;
  public isDefault!: boolean;
  public isActive!: boolean;
  public purpose!: string | null;
  public ribDocumentUrl!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EmployeeBankAccount.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Employee',
        key: 'id',
      },
    },
    accountType: {
      type: DataTypes.ENUM('bank', 'mobile_money'),
      allowNull: false,
      defaultValue: 'bank',
    },
    bankName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    bankCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    branchName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    branchCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    bankAddress: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    accountNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    iban: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    swiftCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    routingNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    accountHolderName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    accountCategory: {
      type: DataTypes.ENUM('current', 'savings', 'other'),
      defaultValue: 'current',
    },
    mobileOperator: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    purpose: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ribDocumentUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'EmployeeBankAccount',
    modelName: 'EmployeeBankAccount',
    freezeTableName: true,
  }
);

export default EmployeeBankAccount;
