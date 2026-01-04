import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class FrameworkAgreement extends Model {}

FrameworkAgreement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agreementNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tenderId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Appel d\'offres source',
    },
    ministryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('GOODS', 'SERVICES', 'WORKS', 'CONSULTING'),
      allowNull: false,
    },
    subCategory: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('SINGLE_SUPPLIER', 'MULTI_SUPPLIER', 'CASCADING'),
      defaultValue: 'SINGLE_SUPPLIER',
      comment: 'Mono-attributaire, multi-attributaires, ou cascade',
    },
    // Période de validité
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isRenewable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    renewalCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    maxRenewals: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    renewalPeriodMonths: {
      type: DataTypes.INTEGER,
      defaultValue: 12,
    },
    // Valeur et limites
    maxValue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      comment: 'Montant maximum de l\'accord-cadre',
    },
    minOrderValue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    maxOrderValue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    usedValue: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
    },
    // Quantités
    maxQuantity: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    usedQuantity: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // Conditions
    priceRevisionClause: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priceRevisionIndex: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    deliveryTerms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    paymentTerms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    warrantyTerms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    penaltyClause: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Catalogue (pour accords avec catalogue)
    hasCatalog: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    catalogItems: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Articles du catalogue [{code, name, description, unit, price}]',
    },
    // Statut
    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'PENDING_APPROVAL',
        'ACTIVE',
        'SUSPENDED',
        'EXPIRED',
        'TERMINATED',
        'RENEWED'
      ),
      defaultValue: 'DRAFT',
    },
    // Alertes
    alertDays: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      comment: 'Jours avant expiration pour alerte',
    },
    alertSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Notes et documents
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Gestion
    signedByClientId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    signedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'framework_agreements',
    modelName: 'FrameworkAgreement',
    timestamps: true,
    underscored: true,
  }
);

export default FrameworkAgreement;
