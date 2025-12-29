import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class EmployeeChild extends Model {}

EmployeeChild.init(
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
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('M', 'F'),
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    placeOfBirth: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    relationshipType: {
      type: DataTypes.ENUM('biological', 'adopted', 'step_child', 'ward'),
      allowNull: false,
      defaultValue: 'biological',
    },
    isStudent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    schoolName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    schoolLevel: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    birthCertificateUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    adoptionCertificateUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isDependent: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isBeneficiary: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    receivesAllowance: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    allowanceAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    insuranceCardNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'EmployeeChild',
    modelName: 'EmployeeChild',
    freezeTableName: true,
  }
);

export default EmployeeChild;
