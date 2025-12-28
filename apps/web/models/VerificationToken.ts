import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface VerificationTokenAttributes {
  identifier: string;
  token: string;
  expires: Date;
}

class VerificationToken extends Model<VerificationTokenAttributes> implements VerificationTokenAttributes {
  public identifier!: string;
  public token!: string;
  public expires!: Date;
}

VerificationToken.init(
  {
    identifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'VerificationToken',
    modelName: 'VerificationToken',
    freezeTableName: true,
    timestamps: false,
  }
);

export default VerificationToken;
