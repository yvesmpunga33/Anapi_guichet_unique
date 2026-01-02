import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class DossierDocument extends Model {}

DossierDocument.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    dossierId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        'RCCM',
        'ID_NATIONAL',
        'NIF',
        'BUSINESS_PLAN',
        'FINANCIAL_PROOF',
        'TECHNICAL_STUDY',
        'OTHER'
      ),
      defaultValue: 'OTHER',
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Taille en bytes',
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uploadedById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'dossier_documents',
    modelName: 'DossierDocument',
    timestamps: true,
  }
);

export default DossierDocument;
