import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ActeAdministration extends Model {}

ActeAdministration.init(
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
    ministryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ministries',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.ENUM('INITIATEUR', 'VERIFICATEUR', 'EXAMINATEUR', 'APPROBATEUR', 'SIGNATAIRE', 'NOTIFICATEUR'),
      allowNull: false,
      defaultValue: 'VERIFICATEUR',
    },
    stepNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Numero d\'etape dans le circuit',
    },
    delayDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Delai alloue a cette administration',
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Validation obligatoire ou optionnelle',
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Instructions specifiques pour cette administration',
    },
    contactEmail: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Email du point focal',
    },
    contactPhone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Telephone du point focal',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'actes_administrations',
    modelName: 'ActeAdministration',
    timestamps: true,
    indexes: [
      { fields: ['acteId'] },
      { fields: ['ministryId'] },
      { fields: ['role'] },
      { fields: ['stepNumber'] },
      { fields: ['isActive'] },
      { fields: ['acteId', 'stepNumber'], unique: true },
    ],
  }
);

export default ActeAdministration;
