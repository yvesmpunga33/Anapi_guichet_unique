import http from '../../http-common';

// GET - Statistiques générales du dashboard
export const DashboardGetStats = () => {
  return http.get('/dashboard/stats');
};

// GET - Statistiques des investissements
export const DashboardGetInvestmentStats = () => {
  return http.get('/dashboard/investments');
};

// GET - Statistiques par province
export const DashboardGetProvinceStats = () => {
  return http.get('/dashboard/provinces');
};

// GET - Statistiques par secteur
export const DashboardGetSectorStats = () => {
  return http.get('/dashboard/sectors');
};

// GET - Activités récentes
export const DashboardGetRecentActivities = (limit = 10) => {
  return http.get(`/dashboard/activities?limit=${limit}`);
};

// GET - Projets récents
export const DashboardGetRecentProjects = (limit = 5) => {
  return http.get(`/dashboard/projects/recent?limit=${limit}`);
};

// GET - Investisseurs récents
export const DashboardGetRecentInvestors = (limit = 5) => {
  return http.get(`/dashboard/investors/recent?limit=${limit}`);
};

// GET - Opportunités populaires
export const DashboardGetPopularOpportunities = (limit = 5) => {
  return http.get(`/dashboard/opportunities/popular?limit=${limit}`);
};

// GET - Tendances mensuelles
export const DashboardGetMonthlyTrends = (year) => {
  return http.get(`/dashboard/trends/monthly?year=${year || new Date().getFullYear()}`);
};

// GET - KPIs principaux
export const DashboardGetKPIs = () => {
  return http.get('/dashboard/kpis');
};

// GET - Alertes et notifications
export const DashboardGetAlerts = () => {
  return http.get('/dashboard/alerts');
};

// GET - Statistiques utilisateurs
export const DashboardGetUserStats = () => {
  return http.get('/dashboard/users/stats');
};
