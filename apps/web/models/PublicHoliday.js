import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class PublicHoliday extends Model {}

PublicHoliday.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('NATIONAL', 'RELIGIOUS', 'REGIONAL', 'COMPANY'),
      defaultValue: 'NATIONAL',
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Se répète chaque année à la même date',
    },
    recurringMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '1-12 pour les jours fériés récurrents',
    },
    recurringDay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '1-31 pour les jours fériés récurrents',
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    overtimeRate: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 2.0,
      comment: 'Taux pour le travail ce jour',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'public_holidays',
    modelName: 'PublicHoliday',
    timestamps: true,
    underscored: true,
  }
);

export default PublicHoliday;
