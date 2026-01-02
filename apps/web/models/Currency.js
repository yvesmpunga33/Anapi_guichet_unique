import { DataTypes } from "sequelize";
import sequelize from "../app/lib/sequelize.js";

const Currency = sequelize.define(
  "Currency",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameFr: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "name_fr",
    },
    nameEn: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "name_en",
    },
    symbol: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    decimals: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
    },
    exchangeRate: {
      type: DataTypes.DECIMAL(18, 6),
      allowNull: false,
      defaultValue: 1,
      field: "exchange_rate",
    },
    exchangeRateDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "exchange_rate_date",
    },
    isBaseCurrency: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_base_currency",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "sort_order",
    },
  },
  {
    tableName: "currencies",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Currency;
