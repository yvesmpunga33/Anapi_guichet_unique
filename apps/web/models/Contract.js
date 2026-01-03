import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class Contract extends Model {}

Contract.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    contractNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Numero unique (CONTRAT-2025-00045)',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // Classification
    typeId: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Reference vers ContractType',
    },
    domainId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Reference vers LegalDomain',
    },
    // Parties
    parties: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: 'Liste des parties au contrat [{name, role, representative, contact}]',
    },
    // Objet et description
    object: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Objet du contrat',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Dates
    signatureDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    renewalDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Date de renouvellement tacite',
    },
    // Valeur
    value: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    paymentTerms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Clauses importantes
    obligations: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Liste des obligations [{party, description, dueDate}]',
    },
    // Fichiers
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
    },
    annexes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'Liste des annexes [{name, path, size}]',
    },
    // Statut
    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'PENDING_SIGNATURE',
        'ACTIVE',
        'SUSPENDED',
        'EXPIRED',
        'TERMINATED',
        'RENEWED',
        'ARCHIVED'
      ),
      defaultValue: 'DRAFT',
    },
    // Alertes
    alertDays: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [30, 60, 90],
    },
    lastAlertSent: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Renouvellement
    isRenewable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    renewalType: {
      type: DataTypes.ENUM('MANUAL', 'AUTO', 'TACIT', 'NONE'),
      defaultValue: 'MANUAL',
      comment: 'Type de renouvellement',
    },
    renewalTerms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    previousContractId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    renewedFromId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID du contrat original (si ce contrat est un renouvellement)',
    },
    renewedToId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID du nouveau contrat (si ce contrat a ete renouvele)',
    },
    renewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date de renouvellement',
    },
    renewedById: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Utilisateur ayant effectue le renouvellement',
    },
    renewalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notes sur le renouvellement',
    },
    alertEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Activer les alertes pour ce contrat',
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
  },
  {
    sequelize,
    tableName: 'contracts',
    modelName: 'Contract',
    timestamps: true,
  }
);

export default Contract;
