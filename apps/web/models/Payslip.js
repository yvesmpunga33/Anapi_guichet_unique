import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class Payslip extends Model {}

Payslip.init(
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
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    baseSalary: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    grossSalary: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    netSalary: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'CDF',
    },
    allowances: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    deductions: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    taxes: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'DRAFT',
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Payslip',
    modelName: 'Payslip',
    freezeTableName: true,
  }
);

export default Payslip;
