import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'USER',
    },
    department: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ministryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'ministries',
        key: 'id',
      },
    },
    modules: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Liste des modules auxquels l\'utilisateur a accès',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    emailVerified: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'User',
    modelName: 'User',
    freezeTableName: true,
  }
);

export default User;
