import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const MessageRecipient = sequelize.define('MessageRecipient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  messageId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'messages',
      key: 'id',
    },
  },
  recipientId: {
    type: DataTypes.TEXT,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  recipientType: {
    type: DataTypes.ENUM('TO', 'CC', 'BCC'),
    defaultValue: 'TO',
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
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
  tableName: 'message_recipients',
  timestamps: true,
  underscored: true,
});

export default MessageRecipient;
