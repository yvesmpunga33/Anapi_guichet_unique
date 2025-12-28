import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface AccountAttributes {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AccountCreationAttributes extends Optional<AccountAttributes, 'id' | 'refresh_token' | 'access_token' | 'expires_at' | 'token_type' | 'scope' | 'id_token' | 'session_state'> {}

class Account extends Model<AccountAttributes, AccountCreationAttributes> implements AccountAttributes {
  public id!: string;
  public userId!: string;
  public type!: string;
  public provider!: string;
  public providerAccountId!: string;
  public refresh_token!: string | null;
  public access_token!: string | null;
  public expires_at!: number | null;
  public token_type!: string | null;
  public scope!: string | null;
  public id_token!: string | null;
  public session_state!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Account.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    providerAccountId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    token_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    session_state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Account',
    modelName: 'Account',
    freezeTableName: true,
  }
);

export default Account;
