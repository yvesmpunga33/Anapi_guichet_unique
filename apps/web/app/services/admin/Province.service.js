import http from '../../http-common';

// GET - Liste toutes les provinces
export const ProvinceList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/provinces${queryString ? `?${queryString}` : ''}`);
};

// GET - Provinces publiques (pour la carte)
export const ProvinceListPublic = () => {
  return http.get('/public/provinces');
};

// GET - Obtenir une province par ID
export const ProvinceGetById = (id) => {
  return http.get(`/provinces/${id}`);
};

// GET - Obtenir une province par code
export const ProvinceGetByCode = (code) => {
  return http.get(`/provinces/code/${code}`);
};

// POST - Créer une province
export const ProvinceCreate = (data) => {
  return http.post('/provinces', data);
};

// PUT - Mettre à jour une province
export const ProvinceUpdate = (id, data) => {
  return http.put(`/provinces/${id}`, data);
};

// DELETE - Supprimer une province
export const ProvinceDelete = (id) => {
  return http.delete(`/provinces/${id}`);
};

// GET - Statistiques d'une province
export const ProvinceGetStats = (id) => {
  return http.get(`/provinces/${id}/stats`);
};

// GET - Opportunités d'une province
export const ProvinceGetOpportunities = (id) => {
  return http.get(`/provinces/${id}/opportunities`);
};

// GET - Investisseurs d'une province
export const ProvinceGetInvestors = (id) => {
  return http.get(`/provinces/${id}/investors`);
};

// GET - Projets d'une province
export const ProvinceGetProjects = (id) => {
  return http.get(`/provinces/${id}/projects`);
};

// PUT - Activer/Désactiver une province
export const ProvinceToggleStatus = (id, isActive) => {
  return http.put(`/provinces/${id}/status`, { isActive });
};
