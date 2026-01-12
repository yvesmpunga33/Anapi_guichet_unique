import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProvinceEventRegistration extends Model {}

ProvinceEventRegistration.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'event_id',
      references: {
        model: 'province_events',
        key: 'id',
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organization: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dietaryRestrictions: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'dietary_restrictions',
    },
    specialRequirements: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'special_requirements',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'ATTENDED'),
      defaultValue: 'PENDING',
    },
    paymentStatus: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'REFUNDED', 'WAIVED'),
      defaultValue: 'PENDING',
      field: 'payment_status',
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'payment_reference',
    },
    confirmationCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'confirmation_code',
    },
    checkedInAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'checked_in_at',
    },
  },
  {
    sequelize,
    tableName: 'province_event_registrations',
    modelName: 'ProvinceEventRegistration',
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['event_id'],
      },
      {
        fields: ['email'],
      },
      {
        fields: ['status'],
      },
      {
        unique: true,
        fields: ['event_id', 'email'],
      },
    ],
  }
);

export default ProvinceEventRegistration;
