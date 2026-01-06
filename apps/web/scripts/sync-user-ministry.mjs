import { sequelize } from '../models/index.js';

async function syncTable() {
  try {
    console.log('Adding ministryId column to User table...');

    // Use raw query to add the column if it doesn't exist
    await sequelize.query(`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "ministryId" UUID
      REFERENCES ministries(id) ON DELETE SET NULL ON UPDATE CASCADE
    `);

    console.log('✅ ministryId column added to User table');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

syncTable();
