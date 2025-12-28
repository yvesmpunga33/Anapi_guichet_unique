import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface LegalDocumentAttributes {
  id: string;
  documentNumber: string;
  type: string;
  subType: string | null;
  investmentId: string;
  ministryId: string | null;
  ministryName: string | null;
  province: string | null;
  sector: string | null;
  status: string;
  issueDate: Date | null;
  expiryDate: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LegalDocumentCreationAttributes extends Optional<LegalDocumentAttributes, 'id' | 'subType' | 'ministryId' | 'ministryName' | 'province' | 'sector' | 'status' | 'issueDate' | 'expiryDate'> {}

class LegalDocument extends Model<LegalDocumentAttributes, LegalDocumentCreationAttributes> implements LegalDocumentAttributes {
  public id!: string;
  public documentNumber!: string;
  public type!: string;
  public subType!: string | null;
  public investmentId!: string;
  public ministryId!: string | null;
  public ministryName!: string | null;
  public province!: string | null;
  public sector!: string | null;
  public status!: string;
  public issueDate!: Date | null;
  public expiryDate!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LegalDocument.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    documentNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subType: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    investmentId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ministryId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ministryName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    province: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sector: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'DRAFT',
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'LegalDocument',
    modelName: 'LegalDocument',
    freezeTableName: true,
  }
);

export default LegalDocument;
