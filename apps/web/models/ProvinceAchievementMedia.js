import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProvinceAchievementMedia extends Model {}

ProvinceAchievementMedia.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    achievementId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'achievement_id',
      references: {
        model: 'province_achievements',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('IMAGE', 'VIDEO', 'DOCUMENT'),
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
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order',
    },
    isCover: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_cover',
      comment: 'Image principale de la realisation',
    },
  },
  {
    sequelize,
    tableName: 'province_achievement_media',
    modelName: 'ProvinceAchievementMedia',
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['achievement_id'],
      },
      {
        fields: ['type'],
      },
    ],
  }
);

export default ProvinceAchievementMedia;
