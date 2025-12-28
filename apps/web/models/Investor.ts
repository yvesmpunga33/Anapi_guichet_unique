import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface InvestorAttributes {
  id: string;
  investorCode: string;
  name: string;
  type: string;
  category: string;
  country: string;
  nationality: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  sector: string | null;
  registrationNumber: string | null;
  taxId: string | null;
  status: string;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactPosition: string | null;
  createdById: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface InvestorCreationAttributes extends Optional<InvestorAttributes, 'id' | 'country' | 'nationality' | 'email' | 'phone' | 'address' | 'city' | 'province' | 'sector' | 'registrationNumber' | 'taxId' | 'status' | 'contactName' | 'contactEmail' | 'contactPhone' | 'contactPosition' | 'createdById'> {}

class Investor extends Model<InvestorAttributes, InvestorCreationAttributes> implements InvestorAttributes {
  public id!: string;
  public investorCode!: string;
  public name!: string;
  public type!: string;
  public category!: string;
  public country!: string;
  public nationality!: string | null;
  public email!: string | null;
  public phone!: string | null;
  public address!: string | null;
  public city!: string | null;
  public province!: string | null;
  public sector!: string | null;
  public registrationNumber!: string | null;
  public taxId!: string | null;
  public status!: string;
  public contactName!: string | null;
  public contactEmail!: string | null;
  public contactPhone!: string | null;
  public contactPosition!: string | null;
  public createdById!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Investor.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    investorCode: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.TEXT,
      defaultValue: 'RDC',
    },
    nationality: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    province: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sector: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    registrationNumber: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    taxId: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'PENDING',
    },
    contactName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactEmail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contactPosition: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Investor',
    modelName: 'Investor',
    freezeTableName: true,
  }
);

export default Investor;
