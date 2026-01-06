import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const InternationalTreaty = sequelize.define('InternationalTreaty', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  reference: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  shortTitle: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Type de traité
  treatyType: {
    type: DataTypes.ENUM(
      'BIT',                  // Bilateral Investment Treaty
      'FTA',                  // Free Trade Agreement
      'DTA',                  // Double Taxation Agreement
      'INVESTMENT_PROTECTION', // Protection des investissements
      'ECONOMIC_PARTNERSHIP', // Partenariat économique
      'TRADE_AGREEMENT',      // Accord commercial
      'MULTILATERAL',         // Accord multilatéral
      'REGIONAL',             // Accord régional (SADC, COMESA, etc.)
      'SECTOR_SPECIFIC',      // Accord sectoriel
      'OTHER'
    ),
    defaultValue: 'BIT',
  },
  // Statut du traité
  status: {
    type: DataTypes.ENUM(
      'NEGOTIATING',          // En négociation
      'SIGNED',               // Signé
      'RATIFICATION_PENDING', // En attente de ratification
      'RATIFIED',             // Ratifié
      'IN_FORCE',             // En vigueur
      'SUSPENDED',            // Suspendu
      'TERMINATED',           // Terminé
      'EXPIRED',              // Expiré
      'RENEGOTIATING'         // En renégociation
    ),
    defaultValue: 'NEGOTIATING',
  },
  // Pays partenaires (JSON array)
  partnerCountries: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Liste des pays partenaires avec codes ISO',
  },
  // Organisation régionale (si applicable)
  regionalOrganization: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'SADC, COMESA, UA, etc.',
  },
  // Dates importantes
  negotiationStartDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  signedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ratifiedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  entryIntoForceDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Durée (en années)
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Renouvellement automatique
  autoRenewal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  renewalPeriod: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Période de renouvellement en années',
  },
  // Dispositions clés (JSON)
  keyProvisions: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Dispositions principales du traité',
  },
  // Avantages pour les investisseurs
  investorBenefits: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  // Secteurs couverts
  coveredSectors: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  // Exclusions
  exclusions: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  // Mécanisme de règlement des différends
  disputeResolution: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Documents
  attachments: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  treatyTextUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  // Notes
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Responsable du suivi
  responsibleId: {
    type: DataTypes.STRING,
    allowNull: true,
    references: { model: 'User', key: 'id' },
  },
  createdById: {
    type: DataTypes.STRING,
    allowNull: true,
    references: { model: 'User', key: 'id' },
  },
}, {
  tableName: 'international_treaties',
  timestamps: true,
  indexes: [
    { fields: ['reference'] },
    { fields: ['status'] },
    { fields: ['treatyType'] },
    { fields: ['signedDate'] },
    { fields: ['entryIntoForceDate'] },
    { fields: ['expiryDate'] },
  ],
});

export default InternationalTreaty;
