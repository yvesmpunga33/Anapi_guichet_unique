import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class BidDocument extends Model {}

BidDocument.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bidId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    documentTypeId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('ADMINISTRATIVE', 'TECHNICAL', 'FINANCIAL', 'OTHER'),
      defaultValue: 'ADMINISTRATIVE',
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
    isCompliant: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    complianceNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    checkedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    checkedAt: {
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
    tableName: 'procurement_bid_documents',
    modelName: 'BidDocument',
    timestamps: true,
    underscored: true,
  }
);

export default BidDocument;
