import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class TenderDocument extends Model {}

TenderDocument.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    documentTypeId: {
      type: DataTypes.UUID,
      allowNull: true,
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
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    uploadedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'procurement_tender_documents',
    modelName: 'TenderDocument',
    timestamps: true,
    underscored: true,
  }
);

export default TenderDocument;
