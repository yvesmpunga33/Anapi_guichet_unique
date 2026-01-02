import { DataTypes } from 'sequelize';
import sequelize from '../app/lib/sequelize.js';

const MessageAttachment = sequelize.define('MessageAttachment', {
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
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  filepath: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  filetype: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  filesize: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'message_attachments',
  timestamps: true,
  underscored: true,
});

export default MessageAttachment;
