import { Sequelize } from 'sequelize';

// Singleton pattern pour éviter les connexions multiples en développement
const globalForSequelize = globalThis as unknown as {
  sequelize: Sequelize | undefined;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sequelize =
  globalForSequelize.sequelize ??
  new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: false,
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForSequelize.sequelize = sequelize;
}

// Test de connexion
export async function testConnection(): Promise<boolean> {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}

export default sequelize;
