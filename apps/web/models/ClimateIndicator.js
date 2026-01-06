import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const ClimateIndicator = sequelize.define('ClimateIndicator', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Catégorie d'indicateur
  category: {
    type: DataTypes.ENUM(
      'DOING_BUSINESS',       // Indicateurs Doing Business
      'INVESTMENT_CLIMATE',   // Climat d'investissement
      'GOVERNANCE',           // Gouvernance
      'INFRASTRUCTURE',       // Infrastructure
      'HUMAN_CAPITAL',        // Capital humain
      'COMPETITIVENESS',      // Compétitivité
      'TRADE',                // Commerce
      'CORRUPTION',           // Corruption
      'EASE_OF_BUSINESS',     // Facilité de faire des affaires
      'CUSTOM'                // Indicateur personnalisé
    ),
    defaultValue: 'INVESTMENT_CLIMATE',
  },
  // Sous-catégorie (ex: "Starting a Business", "Getting Credit", etc.)
  subCategory: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  // Type de mesure
  measureType: {
    type: DataTypes.ENUM(
      'SCORE',        // Score (0-100)
      'RANK',         // Classement
      'PERCENTAGE',   // Pourcentage
      'DAYS',         // Nombre de jours
      'COUNT',        // Comptage
      'CURRENCY',     // Montant monétaire
      'INDEX',        // Indice
      'RATIO'         // Ratio
    ),
    defaultValue: 'SCORE',
  },
  // Unité de mesure
  unit: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  // Direction souhaitée (pour savoir si augmentation = amélioration)
  betterDirection: {
    type: DataTypes.ENUM('HIGHER', 'LOWER'),
    defaultValue: 'HIGHER',
  },
  // Source de données
  dataSource: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Ex: Banque Mondiale, FMI, ANAPI',
  },
  // Fréquence de mise à jour
  updateFrequency: {
    type: DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY'),
    defaultValue: 'ANNUALLY',
  },
  // Valeurs cibles
  targetValue: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: true,
  },
  targetYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Actif
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  // Ordre d'affichage
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Métadonnées
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  createdById: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  },
}, {
  tableName: 'climate_indicators',
  timestamps: true,
  indexes: [
    { fields: ['code'] },
    { fields: ['category'] },
    { fields: ['isActive'] },
  ],
});

export default ClimateIndicator;
