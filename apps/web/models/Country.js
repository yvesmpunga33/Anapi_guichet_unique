import { DataTypes } from "sequelize";
import sequelize from "../app/lib/sequelize.js";

const Country = sequelize.define(
  "Country",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(2),
      allowNull: false,
      unique: true,
    },
    code3: {
      type: DataTypes.STRING(3),
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
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nationalityFr: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "nationality_fr",
    },
    phoneCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "phone_code",
    },
    continent: {
      type: DataTypes.STRING(50),
      allowNull: true,
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
    tableName: "countries",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Country;
