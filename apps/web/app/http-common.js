import axios from 'axios';

// Configuration dynamique - détecte automatiquement local vs production
const getBaseURL = () => {
  // Côté client
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Production
    if (hostname === 'anapi.futurissvision.com' || hostname === 'www.anapi.futurissvision.com') {
      return 'https://anapibackend.futurissvision.com/api/v1';
    }

    // Local
    return 'http://localhost:3502/api/v1';
  }

  // Côté serveur - utiliser variable d'env ou défaut
  return process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
    : 'http://localhost:3502/api/v1';
};

// Instance axios pour les appels API
const http = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

// Intercepteur pour ajouter le token d'authentification
http.interceptors.request.use(
  (config) => {
    // Côté client - récupérer le token depuis localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer les erreurs 401 (non autorisé)
    if (error.response?.status === 401) {
      // Rediriger vers login si côté client
      if (typeof window !== 'undefined') {
        // Ne pas rediriger si déjà sur la page login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default http;
