import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface EmployeeChildAttributes {
  id: string;
  employeeId: string;
  lastName: string;
  middleName: string | null;
  firstName: string;
  gender: 'M' | 'F';
  dateOfBirth: Date;
  placeOfBirth: string | null;
  relationshipType: 'biological' | 'adopted' | 'step_child' | 'ward';
  isStudent: boolean;
  schoolName: string | null;
  schoolLevel: string | null;
  birthCertificateUrl: string | null;
  adoptionCertificateUrl: string | null;
  isDependent: boolean;
  isBeneficiary: boolean;
  receivesAllowance: boolean;
  allowanceAmount: number | null;
  insuranceCardNumber: string | null;
  isActive: boolean;
  notes: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmployeeChildCreationAttributes extends Optional<EmployeeChildAttributes,
  'id' | 'middleName' | 'placeOfBirth' | 'isStudent' | 'schoolName' | 'schoolLevel' |
  'birthCertificateUrl' | 'adoptionCertificateUrl' | 'isDependent' | 'isBeneficiary' |
  'receivesAllowance' | 'allowanceAmount' | 'insuranceCardNumber' | 'isActive' | 'notes'> {}

class EmployeeChild extends Model<EmployeeChildAttributes, EmployeeChildCreationAttributes> implements EmployeeChildAttributes {
  public id!: string;
  public employeeId!: string;
  public lastName!: string;
  public middleName!: string | null;
  public firstName!: string;
  public gender!: 'M' | 'F';
  public dateOfBirth!: Date;
  public placeOfBirth!: string | null;
  public relationshipType!: 'biological' | 'adopted' | 'step_child' | 'ward';
  public isStudent!: boolean;
  public schoolName!: string | null;
  public schoolLevel!: string | null;
  public birthCertificateUrl!: string | null;
  public adoptionCertificateUrl!: string | null;
  public isDependent!: boolean;
  public isBeneficiary!: boolean;
  public receivesAllowance!: boolean;
  public allowanceAmount!: number | null;
  public insuranceCardNumber!: string | null;
  public isActive!: boolean;
  public notes!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
