import http from '../../http-common';

// GET - Liste tous les ministères
export const MinistryList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/ministries${queryString ? `?${queryString}` : ''}`);
};

// GET - Ministères actifs seulement
export const MinistryListActive = () => {
  return http.get('/ministries?status=active');
};

// GET - Obtenir un ministère par ID
export const MinistryGetById = (id) => {
  return http.get(`/ministries/${id}`);
};

// POST - Créer un ministère
export const MinistryCreate = (data) => {
  return http.post('/ministries', data);
};

// PUT - Mettre à jour un ministère
export const MinistryUpdate = (id, data) => {
  return http.put(`/ministries/${id}`, data);
};

// DELETE - Supprimer un ministère
export const MinistryDelete = (id) => {
  return http.delete(`/ministries/${id}`);
};

// GET - Utilisateurs d'un ministère
export const MinistryGetUsers = (id) => {
  return http.get(`/ministries/${id}/users`);
};

// GET - Projets d'un ministère
export const MinistryGetProjects = (id) => {
  return http.get(`/ministries/${id}/projects`);
};

// PUT - Activer/Désactiver un ministère
export const MinistryToggleStatus = (id, isActive) => {
  return http.put(`/ministries/${id}/status`, { isActive });
};

// ============ REQUESTS ============
export const MinistryRequestList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/ministries/requests${queryString ? `?${queryString}` : ''}`);
};

export const MinistryRequestUpdate = (id, data) => {
  return http.patch(`/ministries/requests/${id}`, data);
};
