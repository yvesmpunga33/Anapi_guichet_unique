import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class Ministry extends Model {}

Ministry.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    shortName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    contactPerson: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Point focal ANAPI',
    },
    contactEmail: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    contactPhone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'ministries',
    modelName: 'Ministry',
    timestamps: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['isActive'] },
    ],
  }
);

export default Ministry;
