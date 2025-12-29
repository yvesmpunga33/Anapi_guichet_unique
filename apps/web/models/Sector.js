import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class Sector extends Model {}

Sector.init(
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
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'sectors',
        key: 'id',
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'sectors',
    modelName: 'Sector',
    timestamps: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['parentId'] },
      { fields: ['isActive'] },
    ],
  }
);

export default Sector;
