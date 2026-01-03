import sequelize from '../app/lib/sequelize.js';
import ProjectHistory from '../models/ProjectHistory.js';

async function syncProjectHistory() {
  try {
    console.log('Synchronizing ProjectHistory table...');

    await ProjectHistory.sync({ alter: true });

    console.log('ProjectHistory table synchronized successfully!');

    // Verify table exists
    const [results] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_name = 'project_history'"
    );

    if (results.length > 0) {
      console.log('Table project_history exists in database');
    } else {
      console.log('Warning: Table project_history not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error synchronizing ProjectHistory:', error);
    process.exit(1);
  }
}

syncProjectHistory();
