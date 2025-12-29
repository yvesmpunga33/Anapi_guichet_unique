import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class VerificationToken extends Model {}

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
