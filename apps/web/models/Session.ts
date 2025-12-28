import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface SessionAttributes {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SessionCreationAttributes extends Optional<SessionAttributes, 'id'> {}

class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
  public id!: string;
  public sessionToken!: string;
  public userId!: string;
  public expires!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Session',
    modelName: 'Session',
    freezeTableName: true,
  }
);

export default Session;
