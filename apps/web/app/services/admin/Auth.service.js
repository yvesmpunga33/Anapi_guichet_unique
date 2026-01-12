import http from '../../http-common';

// POST - Connexion
export const AuthLogin = (email, password) => {
  return http.post('/auth/login', { email, password });
};

// POST - Inscription
export const AuthRegister = (data) => {
  return http.post('/auth/register', data);
};

// POST - Déconnexion
export const AuthLogout = () => {
  // Supprimer le token local
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
  return http.post('/auth/logout');
};

// GET - Vérifier si connecté
export const AuthCheck = () => {
  return http.get('/auth/check');
};

// POST - Mot de passe oublié
export const AuthForgotPassword = (email) => {
  return http.post('/auth/forgot-password', { email });
};

// POST - Réinitialiser le mot de passe
export const AuthResetPassword = (token, password) => {
  return http.post('/auth/reset-password', { token, password });
};

// POST - Vérifier email
export const AuthVerifyEmail = (token) => {
  return http.post('/auth/verify-email', { token });
};

// POST - Renvoyer email de vérification
export const AuthResendVerification = (email) => {
  return http.post('/auth/resend-verification', { email });
};

// PUT - Changer mot de passe
export const AuthChangePassword = (currentPassword, newPassword) => {
  return http.put('/auth/change-password', { currentPassword, newPassword });
};

// Stocker le token
export const AuthSetToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Récupérer le token
export const AuthGetToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Stocker l'utilisateur
export const AuthSetUser = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Récupérer l'utilisateur
export const AuthGetUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Vérifier si connecté localement
export const AuthIsAuthenticated = () => {
  return !!AuthGetToken();
};

// Effacer les données d'authentification
export const AuthClear = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// GET - Check CAPTCHA status
export const AuthCaptchaStatus = (email) => {
  const params = new URLSearchParams();
  if (email) params.append("email", email);
  return http.get(`/auth/captcha?${params.toString()}`);
};

// POST - Verify CAPTCHA
export const AuthCaptchaVerify = (captchaId, answer) => {
  return http.post('/auth/captcha', { captchaId, answer });
};
