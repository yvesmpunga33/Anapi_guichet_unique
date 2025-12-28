import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface EmployeeEmergencyContactAttributes {
  id: string;
  employeeId: string;
  fullName: string;
  relationship: string;
  phone: string;
  alternatePhone: string | null;
  email: string | null;
  address: string | null;
  isPrimary: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EmployeeEmergencyContactCreationAttributes extends Optional<EmployeeEmergencyContactAttributes,
  'id' | 'alternatePhone' | 'email' | 'address' | 'isPrimary' | 'isActive'> {}

class EmployeeEmergencyContact extends Model<EmployeeEmergencyContactAttributes, EmployeeEmergencyContactCreationAttributes> implements EmployeeEmergencyContactAttributes {
  public id!: string;
  public employeeId!: string;
  public fullName!: string;
  public relationship!: string;
  public phone!: string;
  public alternatePhone!: string | null;
  public email!: string | null;
  public address!: string | null;
  public isPrimary!: boolean;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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
