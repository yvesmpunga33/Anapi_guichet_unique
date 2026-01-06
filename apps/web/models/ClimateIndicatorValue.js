import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const ClimateIndicatorValue = sequelize.define('ClimateIndicatorValue', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  indicatorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'climate_indicators', key: 'id' },
  },
  // Période
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quarter: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '1-4 pour les indicateurs trimestriels',
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '1-12 pour les indicateurs mensuels',
  },
  // Valeur
  value: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
  },
  // Valeur précédente (pour calcul de variation)
  previousValue: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: true,
  },
  // Variation en pourcentage
  changePercentage: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  // Classement (si applicable)
  rank: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rankOutOf: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Classement sur combien de pays',
  },
  // Comparaison régionale
  regionalAverage: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: true,
  },
  regionalRank: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Notes et commentaires
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Source spécifique pour cette valeur
  source: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  sourceUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  // Date de publication
  publishedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Vérifié
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  verifiedById: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
  // Créateur
  createdById: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
}, {
  tableName: 'climate_indicator_values',
  timestamps: true,
  indexes: [
    { fields: ['indicatorId'] },
    { fields: ['year'] },
    { fields: ['indicatorId', 'year'], unique: false },
    { fields: ['indicatorId', 'year', 'quarter'] },
  ],
});

export default ClimateIndicatorValue;
