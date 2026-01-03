import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class BidderDocument extends Model {}

BidderDocument.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bidderId: {
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
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verifiedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    verifiedAt: {
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
    tableName: 'procurement_bidder_documents',
    modelName: 'BidderDocument',
    timestamps: true,
    underscored: true,
  }
);

export default BidderDocument;
