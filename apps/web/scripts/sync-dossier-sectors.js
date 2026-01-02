import sequelize from '../app/lib/sequelize.js';
import DossierSector from '../models/DossierSector.js';

async function syncDossierSectors() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Sync the DossierSector model
    console.log('Syncing DossierSector table...');
    await DossierSector.sync({ alter: true });
    console.log('DossierSector table synced');

    // Check the table columns
    const result = await sequelize.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'dossier_sectors' ORDER BY ordinal_position"
    );
    console.log('\nDossierSector table columns:');
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

syncDossierSectors();
