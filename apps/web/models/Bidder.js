import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class Bidder extends Model {}

Bidder.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    companyName: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    tradeName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    legalForm: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    rccm: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    idnat: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nif: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    niss: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    capitalSocial: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
    },
    foundingDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    countryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    provinceId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    cityId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    phone2: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    fax: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contactPerson: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contactTitle: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bankName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bankAccountNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    bankSwiftCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    mainActivity: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sectors: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    employeeCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    annualRevenue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    certifications: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BLACKLISTED', 'PENDING_VERIFICATION'),
      defaultValue: 'ACTIVE',
    },
    blacklistReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    blacklistStartDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    blacklistEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    blacklistedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    totalContractsWon: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalContractsValue: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0,
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    verifiedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'procurement_bidders',
    modelName: 'Bidder',
    timestamps: true,
    underscored: true,
  }
);

export default Bidder;
