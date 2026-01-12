import http from '../../http-common';

// GET - Liste tous les secteurs
export const SectorList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/sectors${queryString ? `?${queryString}` : ''}`);
};

// GET - Secteurs actifs seulement
export const SectorListActive = () => {
  return http.get('/sectors?status=active');
};

// GET - Obtenir un secteur par ID
export const SectorGetById = (id) => {
  return http.get(`/sectors/${id}`);
};

// GET - Obtenir un secteur par code
export const SectorGetByCode = (code) => {
  return http.get(`/sectors/code/${code}`);
};

// POST - Créer un secteur
export const SectorCreate = (data) => {
  return http.post('/sectors', data);
};

// PUT - Mettre à jour un secteur
export const SectorUpdate = (id, data) => {
  return http.put(`/sectors/${id}`, data);
};

// DELETE - Supprimer un secteur
export const SectorDelete = (id) => {
  return http.delete(`/sectors/${id}`);
};

// GET - Opportunités d'un secteur
export const SectorGetOpportunities = (id) => {
  return http.get(`/sectors/${id}/opportunities`);
};

// GET - Projets d'un secteur
export const SectorGetProjects = (id) => {
  return http.get(`/sectors/${id}/projects`);
};

// GET - Statistiques d'un secteur
export const SectorGetStats = (id) => {
  return http.get(`/sectors/${id}/stats`);
};

// PUT - Activer/Désactiver un secteur
export const SectorToggleStatus = (id, isActive) => {
  return http.put(`/sectors/${id}/status`, { isActive });
};
