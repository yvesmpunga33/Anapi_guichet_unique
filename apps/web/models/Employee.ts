import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface EmployeeAttributes {
  id: string;
  matricule: string;
  // Identity
  firstName: string;
  lastName: string;
  middleName: string | null; // Post-nom
  gender: 'M' | 'F' | 'OTHER';
  photoUrl: string | null;
  // Birth info
  dateOfBirth: Date | null;
  placeOfBirth: string | null;
  provinceOfOrigin: string | null;
  nationality: string;
  countryOfBirth: string | null;
  // Marital status
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'civil_union';
  marriageDate: Date | null;
  marriageRegime: string | null;
  numberOfChildren: number;
  dependentsCount: number;
  // Address
  addressLine1: string | null;
  addressLine2: string | null;
  neighborhood: string | null; // Quartier
  commune: string | null;
  city: string | null;
  province: string | null;
  country: string;
  postalCode: string | null;
  // Contact
  phonePrimary: string | null;
  phoneSecondary: string | null;
  personalEmail: string | null;
  workEmail: string;
  // Legacy ID documents (kept for backwards compatibility, detailed in EmployeeIdentityDocument)
  nationalIdNumber: string | null;
  nationalIdIssueDate: Date | null;
  nationalIdExpiryDate: Date | null;
  passportNumber: string | null;
  passportIssueDate: Date | null;
  passportExpiryDate: Date | null;
  socialSecurityNumber: string | null; // INSS
  taxIdNumber: string | null;
  driverLicenseNumber: string | null;
  driverLicenseExpiry: Date | null;
  // Professional info
  departmentId: string | null;
  positionId: string | null;
  gradeId: string | null;
  categoryId: string | null;
  managerId: string | null;
  costCenterId: string | null;
  userId: string | null;
  // Contract info
  hireDate: Date;
  contractType: 'CDI' | 'CDD' | 'INTERIM' | 'STAGE' | 'FREELANCE';
  contractStartDate: Date | null;
  contractEndDate: Date | null;
  probationEndDate: Date | null;
  terminationDate: Date | null;
  terminationReason: string | null;
  // Salary
  baseSalary: number;
  currency: string;
  // Status
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  isActive: boolean;
  // Metadata
  createdBy: string | null;
  updatedBy: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmployeeCreationAttributes extends Optional<EmployeeAttributes,
  'id' | 'middleName' | 'gender' | 'photoUrl' | 'dateOfBirth' | 'placeOfBirth' |
  'provinceOfOrigin' | 'nationality' | 'countryOfBirth' | 'maritalStatus' |
  'marriageDate' | 'marriageRegime' | 'numberOfChildren' | 'dependentsCount' |
  'addressLine1' | 'addressLine2' | 'neighborhood' | 'commune' | 'city' |
  'province' | 'country' | 'postalCode' | 'phonePrimary' | 'phoneSecondary' |
  'personalEmail' | 'nationalIdNumber' | 'nationalIdIssueDate' | 'nationalIdExpiryDate' |
  'passportNumber' | 'passportIssueDate' | 'passportExpiryDate' | 'socialSecurityNumber' |
  'taxIdNumber' | 'driverLicenseNumber' | 'driverLicenseExpiry' | 'departmentId' |
  'positionId' | 'gradeId' | 'categoryId' | 'managerId' | 'costCenterId' | 'userId' |
  'contractType' | 'contractStartDate' | 'contractEndDate' | 'probationEndDate' |
  'terminationDate' | 'terminationReason' | 'baseSalary' | 'currency' | 'status' |
  'isActive' | 'createdBy' | 'updatedBy'> {}

class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
  public id!: string;
  public matricule!: string;
  public firstName!: string;
  public lastName!: string;
  public middleName!: string | null;
  public gender!: 'M' | 'F' | 'OTHER';
  public photoUrl!: string | null;
  public dateOfBirth!: Date | null;
  public placeOfBirth!: string | null;
  public provinceOfOrigin!: string | null;
  public nationality!: string;
  public countryOfBirth!: string | null;
  public maritalStatus!: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'civil_union';
  public marriageDate!: Date | null;
  public marriageRegime!: string | null;
  public numberOfChildren!: number;
  public dependentsCount!: number;
  public addressLine1!: string | null;
  public addressLine2!: string | null;
  public neighborhood!: string | null;
  public commune!: string | null;
  public city!: string | null;
  public province!: string | null;
  public country!: string;
  public postalCode!: string | null;
  public phonePrimary!: string | null;
  public phoneSecondary!: string | null;
  public personalEmail!: string | null;
  public workEmail!: string;
  public nationalIdNumber!: string | null;
  public nationalIdIssueDate!: Date | null;
  public nationalIdExpiryDate!: Date | null;
  public passportNumber!: string | null;
  public passportIssueDate!: Date | null;
  public passportExpiryDate!: Date | null;
  public socialSecurityNumber!: string | null;
  public taxIdNumber!: string | null;
  public driverLicenseNumber!: string | null;
  public driverLicenseExpiry!: Date | null;
  public departmentId!: string | null;
  public positionId!: string | null;
  public gradeId!: string | null;
  public categoryId!: string | null;
  public managerId!: string | null;
  public costCenterId!: string | null;
  public userId!: string | null;
  public hireDate!: Date;
  public contractType!: 'CDI' | 'CDD' | 'INTERIM' | 'STAGE' | 'FREELANCE';
  public contractStartDate!: Date | null;
  public contractEndDate!: Date | null;
  public probationEndDate!: Date | null;
  public terminationDate!: Date | null;
  public terminationReason!: string | null;
  public baseSalary!: number;
  public currency!: string;
  public status!: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  public isActive!: boolean;
  public createdBy!: string | null;
  public updatedBy!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
