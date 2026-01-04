import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class FrameworkAgreementSupplier extends Model {}

FrameworkAgreementSupplier.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agreementId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    bidderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    rank: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: 'Rang pour les accords en cascade',
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'REMOVED'),
      defaultValue: 'ACTIVE',
    },
    // Conditions spécifiques au fournisseur
    specificDiscount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Remise spécifique en %',
    },
    specificTerms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Limites spécifiques
    maxValue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    usedValue: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    // Performance
    ordersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    averageRating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    // Notes
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    addedById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'framework_agreement_suppliers',
    modelName: 'FrameworkAgreementSupplier',
    timestamps: true,
    underscored: true,
  }
);

export default FrameworkAgreementSupplier;
