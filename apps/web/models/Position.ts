import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../app/lib/sequelize';

interface PositionAttributes {
  id: string;
  code: string;
  title: string;
  description: string | null;
  departmentId: string | null;
  gradeId: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PositionCreationAttributes extends Optional<PositionAttributes, 'id' | 'description' | 'departmentId' | 'gradeId' | 'isActive'> {}

class Position extends Model<PositionAttributes, PositionCreationAttributes> implements PositionAttributes {
  public id!: string;
  public code!: string;
  public title!: string;
  public description!: string | null;
  public departmentId!: string | null;
  public gradeId!: string | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Position.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    gradeId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'Position',
    modelName: 'Position',
    freezeTableName: true,
  }
);

export default Position;
