import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'agent',
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'fr',
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
    provinceId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'province_id',
    },
    cityId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'city_id',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    modules: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      get() {
        const value = this.getDataValue('modules');
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch {
            return [];
          }
        }
        return [];
      },
      set(value) {
        // S'assurer que la valeur est un tableau valide avant de la sauvegarder
        if (!value) {
          this.setDataValue('modules', []);
          return;
        }
        if (Array.isArray(value)) {
          this.setDataValue('modules', value);
          return;
        }
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);
            this.setDataValue('modules', Array.isArray(parsed) ? parsed : []);
          } catch {
            this.setDataValue('modules', []);
          }
          return;
        }
        this.setDataValue('modules', []);
      },
    },
    ministryId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'ministry_id',
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    underscored: true,
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default User;
