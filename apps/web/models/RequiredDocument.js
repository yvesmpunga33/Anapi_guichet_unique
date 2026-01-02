import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class RequiredDocument extends Model {}

RequiredDocument.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Code unique du document (ex: RCCM, ID_NAT)',
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Nom du document (ex: Registre de commerce)',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description ou instructions pour ce document',
    },
    dossierType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Type de dossier (LICENCE_EXPLOITATION, PERMIS_CONSTRUCTION, etc.)',
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Document obligatoire ou optionnel',
    },
    acceptedFormats: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: ['pdf', 'jpg', 'jpeg', 'png'],
      comment: 'Formats de fichier acceptes',
    },
    maxSizeMB: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10,
      comment: 'Taille maximale en MB',
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Ordre d\'affichage',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'required_documents',
    modelName: 'RequiredDocument',
    timestamps: true,
    indexes: [
      { fields: ['dossierType'] },
      { fields: ['code', 'dossierType'], unique: true },
      { fields: ['isActive'] },
      { fields: ['order'] },
    ],
  }
);

export default RequiredDocument;
