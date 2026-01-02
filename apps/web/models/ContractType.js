import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ContractType extends Model {}

ContractType.init(
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
      comment: 'Code unique (PREST, PART, BAIL, etc.)',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nom du type de contrat',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    defaultDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duree par defaut en mois',
    },
    alertDays: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [30, 60, 90],
      comment: 'Jours avant expiration pour alertes',
    },
    requiredFields: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    template: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Modele de contrat',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'contract_types',
    modelName: 'ContractType',
    timestamps: true,
  }
);

export default ContractType;
