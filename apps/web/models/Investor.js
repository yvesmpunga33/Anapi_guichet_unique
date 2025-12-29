import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class Investor extends Model {}

Investor.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    investorCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('company', 'individual', 'organization', 'government'),
      allowNull: false,
      defaultValue: 'company',
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: 'RDC',
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Contact person
    contactPerson: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactPosition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Legal documents
    rccm: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idNat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nif: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Status
    status: {
      type: DataTypes.ENUM('ACTIVE', 'PENDING', 'SUSPENDED', 'INACTIVE'),
      defaultValue: 'PENDING',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Description
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Metadata
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'investors',
    modelName: 'Investor',
    timestamps: true,
  }
);

export default Investor;
