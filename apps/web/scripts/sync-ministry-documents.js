import sequelize from '../app/lib/sequelize.js';
import MinistryRequestDocument from '../models/MinistryRequestDocument.js';

async function syncMinistryDocuments() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Sync the MinistryRequestDocument model
    console.log('Syncing MinistryRequestDocument table...');
    await MinistryRequestDocument.sync({ alter: true });
    console.log('MinistryRequestDocument table synced');

    // Check the table columns
    const result = await sequelize.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ministry_request_documents' ORDER BY ordinal_position"
    );
    console.log('\nMinistryRequestDocument table columns:');
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

syncMinistryDocuments();
