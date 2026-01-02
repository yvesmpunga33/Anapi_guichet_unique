import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('NORMAL', 'HIGH', 'URGENT'),
    defaultValue: 'NORMAL',
  },
  senderId: {
    type: DataTypes.TEXT,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'messages',
  timestamps: true,
  underscored: true,
});

export default Message;
