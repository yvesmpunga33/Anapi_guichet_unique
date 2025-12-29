import { DataTypes, Model } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

class EmployeeEmergencyContact extends Model {}

EmployeeEmergencyContact.init(
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
    fullName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    relationship: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    alternatePhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'EmployeeEmergencyContact',
    modelName: 'EmployeeEmergencyContact',
    freezeTableName: true,
  }
);

export default EmployeeEmergencyContact;
