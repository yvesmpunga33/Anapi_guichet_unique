import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProvinceGallery extends Model {}

ProvinceGallery.init(
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
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('IMAGE', 'VIDEO'),
      defaultValue: 'IMAGE',
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'thumbnail_url',
    },
    category: {
      type: DataTypes.ENUM('PAYSAGE', 'INFRASTRUCTURE', 'CULTURE', 'EVENEMENT', 'TOURISME', 'ECONOMIE', 'GOUVERNEMENT', 'AUTRE'),
      defaultValue: 'AUTRE',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    takenAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'taken_at',
      comment: 'Date de prise de la photo/video',
    },
    photographer: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Photographe/videaste',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'view_count',
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'download_count',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_featured',
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_published',
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order',
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by_id',
    },
  },
  {
    sequelize,
    tableName: 'province_gallery',
    modelName: 'ProvinceGallery',
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
        fields: ['category'],
      },
      {
        fields: ['is_published'],
      },
      {
        fields: ['is_featured'],
      },
    ],
  }
);

export default ProvinceGallery;
