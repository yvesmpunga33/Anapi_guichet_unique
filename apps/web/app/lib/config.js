// Configuration dynamique basée sur le domaine
// Détecte automatiquement si on est en local ou en production
// Aucune configuration manuelle nécessaire sur le serveur

// Domaines de production
const PRODUCTION_DOMAINS = [
  'anapi.futurissvision.com',
  'www.anapi.futurissvision.com'
];

const BACKEND_PRODUCTION_URL = 'https://anapibackend.futurissvision.com';
const BACKEND_LOCAL_URL = 'http://localhost:3502';

const FRONTEND_PRODUCTION_URL = 'https://anapi.futurissvision.com';
const FRONTEND_LOCAL_URL = 'http://localhost:3500';

// Configuration de la base de données
const DATABASE_PRODUCTION = 'postgresql://anapi_user:%40db_futuriss2025@localhost:5432/anapi_db';
const DATABASE_LOCAL = 'postgresql://yvesmpunga:toor@localhost:5432/anapi_db';

/**
 * Détecte si on est en environnement de production
 */
const detectProduction = () => {
  // Côté serveur
  if (typeof window === 'undefined') {
    // Vérifier si on a un header host de production (via les requêtes)
    // Ou si NODE_ENV est production
    if (process.env.NODE_ENV === 'production') {
      return true;
    }
    // Vérifier VERCEL_URL ou autres indicateurs de production
    if (process.env.VERCEL_URL || process.env.RAILWAY_STATIC_URL) {
      return true;
    }
    return false;
  }

  // Côté client - vérifier le domaine
  return PRODUCTION_DOMAINS.includes(window.location.hostname);
};

/**
 * Détecte la production à partir du header host (pour les API routes)
 */
const detectProductionFromHost = (host) => {
  if (!host) return false;
  return PRODUCTION_DOMAINS.some(domain => host.includes(domain));
};

/**
 * Obtient l'URL de base du frontend
 */
const getBaseUrl = () => {
  // Côté serveur
  if (typeof window === 'undefined') {
    if (process.env.NEXTAUTH_URL) {
      return process.env.NEXTAUTH_URL;
    }
    if (detectProduction()) {
      return FRONTEND_PRODUCTION_URL;
    }
    return FRONTEND_LOCAL_URL;
  }

  // Côté client - utiliser l'URL actuelle
  return window.location.origin;
};

/**
 * Obtient l'URL de l'API backend
 */
const getApiUrl = (hostHeader = null) => {
  // Si on a un header host, l'utiliser pour détecter
  if (hostHeader) {
    return detectProductionFromHost(hostHeader) ? BACKEND_PRODUCTION_URL : BACKEND_LOCAL_URL;
  }

  // Côté client
  if (typeof window !== 'undefined') {
    return detectProduction() ? BACKEND_PRODUCTION_URL : BACKEND_LOCAL_URL;
  }

  // Côté serveur - utiliser la variable d'env ou détecter
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return detectProduction() ? BACKEND_PRODUCTION_URL : BACKEND_LOCAL_URL;
};

/**
 * Obtient l'URL de la base de données
 */
const getDatabaseUrl = (hostHeader = null) => {
  // Si une variable d'environnement est définie, l'utiliser
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Sinon, détecter automatiquement
  if (hostHeader) {
    return detectProductionFromHost(hostHeader) ? DATABASE_PRODUCTION : DATABASE_LOCAL;
  }

  return detectProduction() ? DATABASE_PRODUCTION : DATABASE_LOCAL;
};

// Configuration exportée
export const config = {
  // URLs de production
  productionDomains: PRODUCTION_DOMAINS,
  backendProductionUrl: BACKEND_PRODUCTION_URL,
  backendLocalUrl: BACKEND_LOCAL_URL,
  frontendProductionUrl: FRONTEND_PRODUCTION_URL,
  frontendLocalUrl: FRONTEND_LOCAL_URL,

  // Méthodes de détection
  detectProduction,
  detectProductionFromHost,

  // URL de base de l'application
  get baseUrl() {
    return getBaseUrl();
  },

  // URL de l'API backend
  get apiUrl() {
    return getApiUrl();
  },

  // Obtenir l'URL API avec un header host spécifique
  getApiUrlFromHost(host) {
    return getApiUrl(host);
  },

  // Est-ce la production?
  get isProduction() {
    return detectProduction();
  },

  // Configuration de la base de données
  get databaseUrl() {
    return getDatabaseUrl();
  },

  // Obtenir l'URL DB avec un header host spécifique
  getDatabaseUrlFromHost(host) {
    return getDatabaseUrl(host);
  },
};

// Export des URLs pour utilisation directe
export const API_URL = config.apiUrl;
export const BASE_URL = config.baseUrl;
export const IS_PRODUCTION = config.isProduction;
export const DATABASE_URL = config.databaseUrl;

// Helper pour les API routes Next.js
export function getConfigFromRequest(request) {
  const host = request.headers.get('host') || '';
  const isProduction = detectProductionFromHost(host);

  return {
    isProduction,
    apiUrl: isProduction ? BACKEND_PRODUCTION_URL : BACKEND_LOCAL_URL,
    databaseUrl: isProduction ? DATABASE_PRODUCTION : DATABASE_LOCAL,
    baseUrl: isProduction ? FRONTEND_PRODUCTION_URL : FRONTEND_LOCAL_URL,
  };
}

export default config;
