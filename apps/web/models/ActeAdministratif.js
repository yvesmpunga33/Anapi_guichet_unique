import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ActeAdministratif extends Model {}

ActeAdministratif.init(
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
    shortName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('LICENCE', 'PERMIS', 'AUTORISATION', 'AGREMENT', 'CERTIFICAT', 'ATTESTATION'),
      allowNull: false,
      defaultValue: 'AUTORISATION',
    },
    sectorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'sectors',
        key: 'id',
      },
    },
    ministryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'ministries',
        key: 'id',
      },
    },
    legalBasis: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Base legale (loi, decret, arrete)',
    },
    legalDelayDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      comment: 'Delai legal en jours ouvrables',
    },
    warningDelayDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      comment: 'Delai d\'alerte avant expiration',
    },
    cost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Cout officiel',
    },
    costCDF: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Cout en CDF (optionnel)',
    },
    currency: {
      type: DataTypes.ENUM('USD', 'CDF'),
      allowNull: false,
      defaultValue: 'USD',
    },
    validityMonths: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duree de validite en mois (null = illimite)',
    },
    isRenewable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    renewalDelayDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Delai pour demander le renouvellement',
    },
    workflowType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'DOSSIER',
      comment: 'Type de workflow associe',
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Instructions pour le demandeur',
    },
    prerequisites: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Prerequis ou conditions',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'actes_administratifs',
    modelName: 'ActeAdministratif',
    timestamps: true,
    indexes: [
      { fields: ['code'], unique: true },
      { fields: ['category'] },
      { fields: ['ministryId'] },
      { fields: ['sectorId'] },
      { fields: ['isActive'] },
    ],
  }
);

export default ActeAdministratif;
