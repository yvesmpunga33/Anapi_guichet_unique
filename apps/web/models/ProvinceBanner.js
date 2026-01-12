import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProvinceBanner extends Model {}

ProvinceBanner.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    provinceId: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'province_id',
      references: {
        model: 'provinces',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Titre de la banniere',
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Sous-titre',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mediaType: {
      type: DataTypes.ENUM('IMAGE', 'VIDEO'),
      defaultValue: 'IMAGE',
      field: 'media_type',
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'media_url',
      comment: 'URL de l\'image ou video',
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'thumbnail_url',
      comment: 'Miniature pour les videos',
    },
    linkUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'link_url',
      comment: 'Lien associe a la banniere',
    },
    linkText: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'link_text',
      comment: 'Texte du bouton/lien',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'start_date',
      comment: 'Date de debut d\'affichage',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_date',
      comment: 'Date de fin d\'affichage',
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by_id',
    },
  },
  {
    sequelize,
    tableName: 'province_banners',
    modelName: 'ProvinceBanner',
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['province_id'],
      },
      {
        fields: ['is_active'],
      },
      {
        fields: ['display_order'],
      },
    ],
  }
);

export default ProvinceBanner;
