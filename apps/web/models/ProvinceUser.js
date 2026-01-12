import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class ProvinceUser extends Model {}

ProvinceUser.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    provinceId: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'province_id',
      references: {
        model: 'provinces',
        key: 'id',
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Photo de profil de l\'utilisateur',
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'MANAGER', 'EDITOR', 'VIEWER'),
      defaultValue: 'VIEWER',
      comment: 'Role dans le portail province',
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Service/departement dans la province',
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Poste/fonction',
    },
    permissions: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Permissions specifiques (modules accessibles)',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified',
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login_at',
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'reset_token',
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reset_token_expiry',
    },
  },
  {
    sequelize,
    tableName: 'province_users',
    modelName: 'ProvinceUser',
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        fields: ['province_id'],
      },
      {
        fields: ['role'],
      },
    ],
  }
);

export default ProvinceUser;
