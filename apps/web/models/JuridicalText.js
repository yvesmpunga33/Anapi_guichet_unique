import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class JuridicalText extends Model {}

JuridicalText.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Numero unique (LOI-2024-00123)',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // Classification
    typeId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference vers LegalDocumentType',
    },
    domainId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Reference vers LegalDomain',
    },
    // References legales
    officialReference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Loi n24-001 du 15/01/2024',
    },
    journalOfficiel: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'JO n2024-05',
    },
    // Dates importantes
    publicationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    effectiveDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date entree en vigueur',
    },
    expirationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date abrogation/expiration',
    },
    // Contenu
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Resume du document',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Texte complet si extrait',
    },
    keywords: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    // Fichier
    filePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Taille en bytes',
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    checksum: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: 'SHA-256 pour integrite',
    },
    // Versioning
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    previousVersionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isCurrentVersion: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Statut
    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'PENDING_APPROVAL',
        'ACTIVE',
        'MODIFIED',
        'ABROGATED',
        'ARCHIVED'
      ),
      defaultValue: 'DRAFT',
    },
    // Relations avec autres documents
    modifiedById: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Document qui modifie celui-ci',
    },
    abrogatedById: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Document qui abroge celui-ci',
    },
    relatedDocuments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'IDs documents lies',
    },
    // Audit
    createdById: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updatedById: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approvedById: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'juridical_texts',
    modelName: 'JuridicalText',
    timestamps: true,
  }
);

export default JuridicalText;
