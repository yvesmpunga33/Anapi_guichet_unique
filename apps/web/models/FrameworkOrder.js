import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class FrameworkOrder extends Model {}

FrameworkOrder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    agreementId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    supplierId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'FrameworkAgreementSupplier ID',
    },
    bidderId: {
      type: DataTypes.UUID,
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
    // Détails de la commande
    items: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Articles commandés [{code, name, quantity, unit, unitPrice, total}]',
    },
    quantity: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    totalValue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
    },
    // Dates
    orderDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expectedDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actualDeliveryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Livraison
    deliveryLocation: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    deliveryContact: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Statut
    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'PENDING_APPROVAL',
        'APPROVED',
        'ORDERED',
        'PARTIALLY_DELIVERED',
        'DELIVERED',
        'COMPLETED',
        'CANCELLED'
      ),
      defaultValue: 'DRAFT',
    },
    // Réception
    receivedQuantity: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    receptionNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    qualityStatus: {
      type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'PARTIAL_REJECTION', 'REJECTED'),
      allowNull: true,
    },
    // Paiement
    invoiceNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paidAmount: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.ENUM('PENDING', 'PARTIAL', 'PAID'),
      defaultValue: 'PENDING',
    },
    // Notes
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Gestion
    requestedById: {
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
    receivedById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'framework_orders',
    modelName: 'FrameworkOrder',
    timestamps: true,
    underscored: true,
  }
);

export default FrameworkOrder;
