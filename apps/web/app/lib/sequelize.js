import { Sequelize } from 'sequelize';
import config from './config.js';

// Singleton pattern pour éviter les connexions multiples en développement
const globalForSequelize = globalThis;

// Utiliser la configuration dynamique qui détecte automatiquement l'environnement
// La détection se fait via le header host de la requête ou NODE_ENV
const getDatabaseUrl = () => {
  // Priorité 1: Variable d'environnement explicite
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Priorité 2: Configuration automatique basée sur NODE_ENV
  return config.databaseUrl;
};

const databaseUrl = getDatabaseUrl();

if (!databaseUrl) {
  console.error('DATABASE_URL not configured. Using config detection.');
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
export async function testConnection() {
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
