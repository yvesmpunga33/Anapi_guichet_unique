import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class SystemConfig extends Model {}

SystemConfig.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: 'Cle de configuration (ex: smtp_host, smtp_port)',
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Valeur de la configuration',
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'general',
      comment: 'Categorie (email, general, security, etc.)',
    },
    type: {
      type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'password'),
      defaultValue: 'string',
      comment: 'Type de donnee',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description de la configuration',
    },
    isEncrypted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Indique si la valeur est chiffree',
    },
    isEditable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Peut etre modifie via l\'interface',
    },
    updatedById: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'system_configs',
    modelName: 'SystemConfig',
    timestamps: true,
  }
);

export default SystemConfig;
