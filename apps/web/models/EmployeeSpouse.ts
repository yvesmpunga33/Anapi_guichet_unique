import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface EmployeeSpouseAttributes {
  id: string;
  employeeId: string;
  relationshipType: 'spouse' | 'civil_partner' | 'partner';
  lastName: string;
  middleName: string | null;
  firstName: string;
  maidenName: string | null;
  gender: 'M' | 'F' | 'OTHER';
  dateOfBirth: Date | null;
  placeOfBirth: string | null;
  nationality: string | null;
  phone: string | null;
  email: string | null;
  profession: string | null;
  employer: string | null;
  isEmployed: boolean | null;
  nationalIdNumber: string | null;
  marriageCertificateUrl: string | null;
  isBeneficiary: boolean;
  insuranceCardNumber: string | null;
  isDependent: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmployeeSpouseCreationAttributes extends Optional<EmployeeSpouseAttributes,
  'id' | 'middleName' | 'maidenName' | 'dateOfBirth' | 'placeOfBirth' | 'nationality' |
  'phone' | 'email' | 'profession' | 'employer' | 'isEmployed' | 'nationalIdNumber' |
  'marriageCertificateUrl' | 'isBeneficiary' | 'insuranceCardNumber' | 'isDependent' | 'isActive'> {}

class EmployeeSpouse extends Model<EmployeeSpouseAttributes, EmployeeSpouseCreationAttributes> implements EmployeeSpouseAttributes {
  public id!: string;
  public employeeId!: string;
  public relationshipType!: 'spouse' | 'civil_partner' | 'partner';
  public lastName!: string;
  public middleName!: string | null;
  public firstName!: string;
  public maidenName!: string | null;
  public gender!: 'M' | 'F' | 'OTHER';
  public dateOfBirth!: Date | null;
  public placeOfBirth!: string | null;
  public nationality!: string | null;
  public phone!: string | null;
  public email!: string | null;
  public profession!: string | null;
  public employer!: string | null;
  public isEmployed!: boolean | null;
  public nationalIdNumber!: string | null;
  public marriageCertificateUrl!: string | null;
  public isBeneficiary!: boolean;
  public insuranceCardNumber!: string | null;
  public isDependent!: boolean;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
