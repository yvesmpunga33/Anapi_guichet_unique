import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class MinistryRequestDocument extends Model {}

MinistryRequestDocument.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    requestId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference vers la demande',
    },
    // Document info from workflow configuration
    documentType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Type de document (depuis la configuration)',
    },
    documentName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nom du document requis',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Request step info
    requestedAtStep: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Etape a laquelle le document a ete demande',
    },
    requestedById: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Agent qui a demande le document',
    },
    requestedByName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requestedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    requestNote: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Note de demande de document',
    },
    // Upload info
    status: {
      type: DataTypes.ENUM('PENDING', 'UPLOADED', 'VALIDATED', 'REJECTED'),
      defaultValue: 'PENDING',
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    uploadedById: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    uploadedByName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Validation info
    validatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    validatedById: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    validatedByName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    validationNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'ministry_request_documents',
    modelName: 'MinistryRequestDocument',
    timestamps: true,
    indexes: [
      {
        fields: ['requestId'],
        name: 'ministry_request_documents_request_idx',
      },
      {
        fields: ['status'],
        name: 'ministry_request_documents_status_idx',
      },
    ],
  }
);

export default MinistryRequestDocument;
