// Configuration dynamique basée sur le domaine
// Détecte automatiquement si on est en local ou en production

const getBaseUrl = () => {
  // Côté serveur
  if (typeof window === 'undefined') {
    // Vérifier les variables d'environnement
    if (process.env.NEXTAUTH_URL) {
      return process.env.NEXTAUTH_URL;
    }
    // Fallback pour le développement
    return 'http://localhost:3500';
  }

  // Côté client - utiliser l'URL actuelle
  return window.location.origin;
};

const isProduction = () => {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production';
  }
  // Côté client - vérifier le domaine
  return window.location.hostname === 'anapi.futurissvision.com';
};

// Configuration des URLs
export const config = {
  // URL de base de l'application
  get baseUrl() {
    return getBaseUrl();
  },

  // URL de l'API backend
  get apiUrl() {
    if (typeof window !== 'undefined') {
      // Côté client - détecter selon le domaine
      if (window.location.hostname === 'anapi.futurissvision.com') {
        return 'https://anapibackend.futurissvision.com';
      }
      return 'http://localhost:3501';
    }
    // Côté serveur
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3501';
  },

  // Est-ce la production?
  get isProduction() {
    return isProduction();
  },

  // Configuration de la base de données
  get databaseUrl() {
    return process.env.DATABASE_URL;
  },
};

// Export des URLs pour utilisation directe
export const API_URL = config.apiUrl;
export const BASE_URL = config.baseUrl;
export const IS_PRODUCTION = config.isProduction;

export default config;
