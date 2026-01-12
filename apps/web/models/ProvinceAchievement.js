import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProvinceAchievement extends Model {}

ProvinceAchievement.init(
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
    category: {
      type: DataTypes.ENUM('INFRASTRUCTURE', 'EDUCATION', 'SANTE', 'AGRICULTURE', 'ENERGIE', 'EAU', 'TRANSPORT', 'NUMERIQUE', 'SOCIAL', 'AUTRE'),
      defaultValue: 'AUTRE',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Lieu de la realisation',
    },
    budget: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: true,
      comment: 'Budget/cout du projet',
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    beneficiaries: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Nombre de beneficiaires',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'start_date',
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completion_date',
    },
    status: {
      type: DataTypes.ENUM('EN_COURS', 'TERMINE', 'INAUGURE'),
      defaultValue: 'TERMINE',
    },
    partners: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'Partenaires du projet',
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'cover_image',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_featured',
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_published',
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by_id',
    },
  },
  {
    sequelize,
    tableName: 'province_achievements',
    modelName: 'ProvinceAchievement',
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
        fields: ['status'],
      },
      {
        fields: ['is_published'],
      },
    ],
  }
);

export default ProvinceAchievement;
