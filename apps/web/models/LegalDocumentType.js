import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class LegalDocumentType extends Model {}

LegalDocumentType.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'Code unique (LOI, DECRET, ARRETE, etc.)',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Nom du type de document',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        'LEGISLATION',
        'REGLEMENTATION',
        'CONTRAT',
        'JURISPRUDENCE',
        'DOCTRINE',
        'INTERNE'
      ),
      allowNull: false,
      defaultValue: 'LEGISLATION',
    },
    requiredFields: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Champs requis selon le type',
    },
    allowedExtensions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: ['.pdf', '.docx'],
    },
    maxFileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 50,
      comment: 'Taille max en MB',
    },
    retentionPeriod: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duree de conservation en annees',
    },
    requiresApproval: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'legal_document_types',
    modelName: 'LegalDocumentType',
    timestamps: true,
  }
);

export default LegalDocumentType;
