import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class OpportunityDocument extends Model {}

OpportunityDocument.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    opportunityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'province_opportunities',
        key: 'id',
      },
      comment: 'Opportunite concernee',
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Nom du document requis',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description du document',
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Document obligatoire ou optionnel',
    },
    category: {
      type: DataTypes.ENUM('LEGAL', 'FINANCIAL', 'TECHNICAL', 'ADMINISTRATIVE', 'OTHER'),
      allowNull: false,
      defaultValue: 'OTHER',
      comment: 'Categorie du document',
    },
    templateUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL du modele de document a telecharger',
    },
    maxFileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10485760, // 10 MB
      comment: 'Taille maximale du fichier en octets',
    },
    allowedFormats: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: 'pdf,doc,docx',
      comment: 'Formats de fichiers acceptes',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Ordre d\'affichage',
    },
  },
  {
    sequelize,
    tableName: 'opportunity_documents',
    modelName: 'OpportunityDocument',
    timestamps: true,
    indexes: [
      { fields: ['opportunityId'] },
      { fields: ['isRequired'] },
      { fields: ['category'] },
      { fields: ['sortOrder'] },
    ],
  }
);

export default OpportunityDocument;
