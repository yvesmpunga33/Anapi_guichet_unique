import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ContractDocument extends Model {}

ContractDocument.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    contractId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    executionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    documentTypeId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('CONTRACT', 'AMENDMENT', 'INVOICE', 'DELIVERY', 'INSPECTION', 'PAYMENT', 'CERTIFICATE', 'OTHER'),
      defaultValue: 'CONTRACT',
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    filepath: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    filetype: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    filesize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    isSigned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    signedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    uploadedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'procurement_contract_documents',
    modelName: 'ContractDocument',
    timestamps: true,
    underscored: true,
  }
);

export default ContractDocument;
