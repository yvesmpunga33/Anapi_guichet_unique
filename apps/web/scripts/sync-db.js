import sequelize from '../app/lib/sequelize.js';
import Investor from '../models/Investor.js';
import Investment from '../models/Investment.js';

async function syncDB() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Sync the Investor model (alter: true will add missing columns)
    console.log('Syncing Investor table...');
    await Investor.sync({ alter: true });
    console.log('Investor table synced');

    // Sync the Investment model
    console.log('Syncing Investment table...');
    await Investment.sync({ alter: true });
    console.log('Investment table synced');

    // Check the investors table columns
    const result = await sequelize.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'investors' ORDER BY ordinal_position"
    );
    console.log('\nInvestor table columns:');
    result[0].forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

    // Count existing investors
    const count = await Investor.count();
    console.log(`\nExisting investors: ${count}`);

    console.log('\nDatabase sync completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

syncDB();
