import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProvinceSettings extends Model {}

ProvinceSettings.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    provinceId: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      field: 'province_id',
      references: {
        model: 'provinces',
        key: 'id',
      },
    },
    // Branding
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Logo de la province',
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Image banniere principale',
    },
    slogan: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Slogan de la province',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description de la province',
    },
    history: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Historique de la province',
    },
    // Couleurs du theme
    primaryColor: {
      type: DataTypes.STRING,
      defaultValue: '#1e40af',
      field: 'primary_color',
    },
    secondaryColor: {
      type: DataTypes.STRING,
      defaultValue: '#64748b',
      field: 'secondary_color',
    },
    accentColor: {
      type: DataTypes.STRING,
      defaultValue: '#f59e0b',
      field: 'accent_color',
    },
    // Contact
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Reseaux sociaux
    socialMedia: {
      type: DataTypes.JSONB,
      defaultValue: {},
      field: 'social_media',
      comment: 'Liens reseaux sociaux {facebook, twitter, instagram, linkedin, youtube}',
    },
    // Configuration du menu dynamique
    menuConfig: {
      type: DataTypes.JSONB,
      defaultValue: {
        dashboard: { enabled: true, order: 1 },
        news: { enabled: true, order: 2 },
        opportunities: { enabled: true, order: 3 },
        achievements: { enabled: true, order: 4 },
        events: { enabled: true, order: 5 },
        gallery: { enabled: true, order: 6 },
        infrastructure: { enabled: true, order: 7 },
        education: { enabled: true, order: 8 },
        health: { enabled: true, order: 9 },
        tourism: { enabled: true, order: 10 },
        organization: { enabled: true, order: 11 },
        investors: { enabled: true, order: 12 },
        jobs: { enabled: true, order: 13 },
        economy: { enabled: true, order: 14 },
        hr: { enabled: true, order: 15 },
        configuration: { enabled: true, order: 16 },
      },
      field: 'menu_config',
      comment: 'Configuration des modules visibles dans le menu',
    },
    // Gouverneur
    governorName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'governor_name',
    },
    governorPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'governor_photo',
    },
    governorTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'governor_title',
      defaultValue: 'Gouverneur de Province',
    },
    governorBio: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'governor_bio',
    },
    // Vice-Gouverneur
    viceGovernorName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'vice_governor_name',
    },
    viceGovernorPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'vice_governor_photo',
    },
    // Photo du President
    presidentPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'president_photo',
    },
    presidentName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'president_name',
      defaultValue: 'Felix Antoine Tshisekedi Tshilombo',
    },
    // Parametres additionnels
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'Africa/Kinshasa',
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'CDF',
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'fr',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_public',
      comment: 'Portail public accessible ou non',
    },
    maintenanceMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'maintenance_mode',
    },
  },
  {
    sequelize,
    tableName: 'province_settings',
    modelName: 'ProvinceSettings',
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['province_id'],
      },
    ],
  }
);

export default ProvinceSettings;
