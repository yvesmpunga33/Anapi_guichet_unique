import { Message, MessageRecipient, MessageAttachment, sequelize } from '../models/index.js';

async function syncTables() {
  try {
    console.log('Syncing message tables...');

    // Sync only the new message tables
    await Message.sync({ alter: true });
    console.log('✅ Message table synced');

    await MessageRecipient.sync({ alter: true });
    console.log('✅ MessageRecipient table synced');

    await MessageAttachment.sync({ alter: true });
    console.log('✅ MessageAttachment table synced');

    console.log('\n🎉 All message tables synced successfully!');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing tables:', error);
    process.exit(1);
  }
}

syncTables();
