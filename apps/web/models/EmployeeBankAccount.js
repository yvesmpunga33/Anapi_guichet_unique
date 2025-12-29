import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class EmployeeBankAccount extends Model {}

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
