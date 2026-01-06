import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ApplicationDocument extends Model {}

ApplicationDocument.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    applicationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'opportunity_applications',
        key: 'id',
      },
      comment: 'Candidature concernee',
    },
    requiredDocumentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'opportunity_documents',
        key: 'id',
      },
      comment: 'Document requis correspondant',
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Nom du document telecharge',
    },
    fileName: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Nom du fichier original',
    },
    filePath: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment: 'Chemin de stockage du fichier',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Taille du fichier en octets',
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Type MIME du fichier',
    },
    status: {
      type: DataTypes.ENUM('UPLOADED', 'VERIFIED', 'REJECTED', 'EXPIRED'),
      allowNull: false,
      defaultValue: 'UPLOADED',
      comment: 'Statut de verification du document',
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verifiedById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    verificationNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notes de verification',
    },
    uploadedById: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'application_documents',
    modelName: 'ApplicationDocument',
    timestamps: true,
    indexes: [
      { fields: ['applicationId'] },
      { fields: ['requiredDocumentId'] },
      { fields: ['status'] },
    ],
  }
);

export default ApplicationDocument;
