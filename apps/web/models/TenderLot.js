import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class TenderLot extends Model {}

TenderLot.init(
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
    lotNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    specifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    estimatedValue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    awardedValue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'AWARDED', 'CANCELLED', 'NO_BID'),
      defaultValue: 'OPEN',
    },
    awardedBidderId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    awardDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'procurement_tender_lots',
    modelName: 'TenderLot',
    timestamps: true,
    underscored: true,
  }
);

export default TenderLot;
