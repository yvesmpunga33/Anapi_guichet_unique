import ProjectDocument from '../models/ProjectDocument.js';
import sequelize from '../app/lib/sequelize.js';

async function sync() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await ProjectDocument.sync({ alter: true });
    console.log('Table project_documents created/updated');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

sync();
