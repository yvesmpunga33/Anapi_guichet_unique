import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class PieceRequise extends Model {}

PieceRequise.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    acteId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'actes_administratifs',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description ou precisions sur le document',
    },
    category: {
      type: DataTypes.ENUM('IDENTITE', 'JURIDIQUE', 'FISCAL', 'TECHNIQUE', 'FINANCIER', 'AUTRE'),
      allowNull: false,
      defaultValue: 'AUTRE',
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Obligatoire ou optionnel',
    },
    acceptedFormats: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'PDF,JPG,PNG',
      comment: 'Formats acceptes separes par virgule',
    },
    maxSizeMB: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10,
      comment: 'Taille max en MB',
    },
    templateUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL du modele a telecharger',
    },
    templateName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Nom du fichier modele',
    },
    orderIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Ordre d\'affichage',
    },
    validityMonths: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duree de validite du document en mois',
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Instructions specifiques pour ce document',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'pieces_requises',
    modelName: 'PieceRequise',
    timestamps: true,
    indexes: [
      { fields: ['acteId'] },
      { fields: ['category'] },
      { fields: ['isRequired'] },
      { fields: ['orderIndex'] },
      { fields: ['isActive'] },
    ],
  }
);

export default PieceRequise;
