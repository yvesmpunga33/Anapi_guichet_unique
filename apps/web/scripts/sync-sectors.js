import sequelize from '../app/lib/sequelize.js';
import Sector from '../models/Sector.js';

async function syncSectors() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Sync the Sector model
    console.log('Syncing Sector table...');
    await Sector.sync({ alter: true });
    console.log('Sector table synced');

    // Check the table columns
    const result = await sequelize.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sectors' ORDER BY ordinal_position"
    );
    console.log('\nSector table columns:');
    result[0].forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

    console.log('\nDatabase sync completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

syncSectors();
