import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface EmployeeIdentityDocumentAttributes {
  id: string;
  employeeId: string;
  documentType: 'national_id' | 'passport' | 'driver_license' | 'residence_permit' | 'work_permit' | 'other';
  documentNumber: string;
  issuingAuthority: string | null;
  issuingCountry: string | null;
  issueDate: Date | null;
  expiryDate: Date | null;
  documentUrl: string | null;
  isVerified: boolean;
  verifiedBy: string | null;
  verifiedAt: Date | null;
  notes: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmployeeIdentityDocumentCreationAttributes extends Optional<EmployeeIdentityDocumentAttributes,
  'id' | 'issuingAuthority' | 'issuingCountry' | 'issueDate' | 'expiryDate' | 'documentUrl' |
  'isVerified' | 'verifiedBy' | 'verifiedAt' | 'notes'> {}

class EmployeeIdentityDocument extends Model<EmployeeIdentityDocumentAttributes, EmployeeIdentityDocumentCreationAttributes> implements EmployeeIdentityDocumentAttributes {
  public id!: string;
  public employeeId!: string;
  public documentType!: 'national_id' | 'passport' | 'driver_license' | 'residence_permit' | 'work_permit' | 'other';
  public documentNumber!: string;
  public issuingAuthority!: string | null;
  public issuingCountry!: string | null;
  public issueDate!: Date | null;
  public expiryDate!: Date | null;
  public documentUrl!: string | null;
  public isVerified!: boolean;
  public verifiedBy!: string | null;
  public verifiedAt!: Date | null;
  public notes!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EmployeeIdentityDocument.init(
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
    documentType: {
      type: DataTypes.ENUM('national_id', 'passport', 'driver_license', 'residence_permit', 'work_permit', 'other'),
      allowNull: false,
    },
    documentNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    issuingAuthority: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    issuingCountry: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    documentUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'EmployeeIdentityDocument',
    modelName: 'EmployeeIdentityDocument',
    freezeTableName: true,
  }
);

export default EmployeeIdentityDocument;
