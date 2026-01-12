import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProvinceNews extends Model {}

ProvinceNews.init(
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
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Resume/extrait de l\'actualite',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'cover_image',
    },
    category: {
      type: DataTypes.ENUM('POLITIQUE', 'ECONOMIE', 'SOCIAL', 'CULTURE', 'SPORT', 'INFRASTRUCTURE', 'ENVIRONNEMENT', 'AUTRE'),
      defaultValue: 'AUTRE',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Source de l\'actualite',
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'view_count',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_featured',
      comment: 'Actualite mise en avant',
    },
    isBreaking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_breaking',
      comment: 'Actualite urgente/breaking news',
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
      defaultValue: 'DRAFT',
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'published_at',
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by_id',
    },
  },
  {
    sequelize,
    tableName: 'province_news',
    modelName: 'ProvinceNews',
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
        unique: true,
        fields: ['province_id', 'slug'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['is_featured'],
      },
      {
        fields: ['published_at'],
      },
    ],
  }
);

export default ProvinceNews;
