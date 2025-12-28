import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface UserAttributes {
  id: string;
  email: string;
  name: string | null;
  password: string | null;
  image: string | null;
  role: string;
  department: string | null;
  phone: string | null;
  isActive: boolean;
  emailVerified: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'name' | 'password' | 'image' | 'role' | 'department' | 'phone' | 'isActive' | 'emailVerified'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public name!: string | null;
  public password!: string | null;
  public image!: string | null;
  public role!: string;
  public department!: string | null;
  public phone!: string | null;
  public isActive!: boolean;
  public emailVerified!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
