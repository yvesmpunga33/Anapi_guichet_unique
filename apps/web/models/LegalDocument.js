import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class LegalDocument extends Model {}

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
