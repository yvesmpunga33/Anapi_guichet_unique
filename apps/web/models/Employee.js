import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class Employee extends Model {}

Employee.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    matricule: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    // Identity
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('M', 'F', 'OTHER'),
      defaultValue: 'M',
    },
    photoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    // Birth info
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    placeOfBirth: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    provinceOfOrigin: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING(50),
      defaultValue: 'Congolaise',
    },
    countryOfBirth: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'RDC',
    },
    // Marital status
    maritalStatus: {
      type: DataTypes.ENUM('single', 'married', 'divorced', 'widowed', 'separated', 'civil_union'),
      defaultValue: 'single',
    },
    marriageDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    marriageRegime: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    numberOfChildren: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dependentsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Address
    addressLine1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    addressLine2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    commune: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(50),
      defaultValue: 'RDC',
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    // Contact
    phonePrimary: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    phoneSecondary: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    personalEmail: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    workEmail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    // Identity documents
    nationalIdNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    nationalIdIssueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    nationalIdExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    passportNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    passportIssueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    passportExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    socialSecurityNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    taxIdNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    driverLicenseNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    driverLicenseExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Professional info
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    positionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    gradeId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    managerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    costCenterId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    // Contract info
    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    contractType: {
      type: DataTypes.ENUM('CDI', 'CDD', 'INTERIM', 'STAGE', 'FREELANCE'),
      defaultValue: 'CDI',
    },
    contractStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    contractEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    probationEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    terminationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    terminationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Salary
    baseSalary: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'CDF',
    },
    // Status
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'),
      defaultValue: 'ACTIVE',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Metadata
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Employee',
    modelName: 'Employee',
    freezeTableName: true,
  }
);

export default Employee;
