import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class EmployeeSpouse extends Model {}

EmployeeSpouse.init(
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
    relationshipType: {
      type: DataTypes.ENUM('spouse', 'civil_partner', 'partner'),
      allowNull: false,
      defaultValue: 'spouse',
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
    maidenName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('M', 'F', 'OTHER'),
      allowNull: false,
      defaultValue: 'F',
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    placeOfBirth: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Congolaise',
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    profession: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    employer: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isEmployed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    nationalIdNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    marriageCertificateUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isBeneficiary: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    insuranceCardNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    isDependent: {
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
    tableName: 'EmployeeSpouse',
    modelName: 'EmployeeSpouse',
    freezeTableName: true,
  }
);

export default EmployeeSpouse;
