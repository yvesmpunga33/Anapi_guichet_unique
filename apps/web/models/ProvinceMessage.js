import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProvinceMessage extends Model {}

ProvinceMessage.init(
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
    type: {
      type: DataTypes.ENUM('GOVERNOR', 'PRESIDENT', 'VICE_GOVERNOR', 'ASSEMBLY_PRESIDENT', 'OTHER'),
      allowNull: false,
      comment: 'Type de message (du Gouverneur, du President, etc.)',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Titre du message',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Contenu du message',
    },
    authorName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'author_name',
      comment: 'Nom de l\'auteur',
    },
    authorTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'author_title',
      comment: 'Titre/fonction de l\'auteur',
    },
    authorPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'author_photo',
      comment: 'Photo de l\'auteur',
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Image de signature',
    },
    displayOnHome: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'display_on_home',
      comment: 'Afficher sur la page d\'accueil',
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
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'published_at',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expires_at',
      comment: 'Date d\'expiration du message',
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'created_by_id',
    },
  },
  {
    sequelize,
    tableName: 'province_messages',
    modelName: 'ProvinceMessage',
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
        fields: ['type'],
      },
      {
        fields: ['is_active'],
      },
      {
        fields: ['display_on_home'],
      },
    ],
  }
);

export default ProvinceMessage;
