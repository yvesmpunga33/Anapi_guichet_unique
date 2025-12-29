import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class EmployeeIdentityDocument extends Model {}

EmployeeIdentityDocument.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Employee',
        key: 'id',
      },
    },
    documentType: {
      type: DataTypes.ENUM('national_id', 'passport', 'driver_license', 'residence_permit', 'work_permit', 'other'),
      allowNull: false,
    },
    documentNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    issuingAuthority: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    issuingCountry: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    documentUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'EmployeeIdentityDocument',
    modelName: 'EmployeeIdentityDocument',
    freezeTableName: true,
  }
);

export default EmployeeIdentityDocument;
