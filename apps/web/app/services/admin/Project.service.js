import http from '../../http-common';

// GET - Liste tous les projets
export const ProjectList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/projects${queryString ? `?${queryString}` : ''}`);
};

// GET - Recherche avec filtres
export const ProjectSearch = (search, status, sector, province) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (sector) params.append('sector', sector);
  if (province) params.append('province', province);
  return http.get(`/projects?${params.toString()}`);
};

// GET - Obtenir un projet par ID
export const ProjectGetById = (id) => {
  return http.get(`/projects/${id}`);
};

// POST - Créer un projet
export const ProjectCreate = (data) => {
  return http.post('/projects', data);
};

// POST - Créer avec FormData (images/documents)
export const ProjectCreateWithFormData = (formData) => {
  return http.post('/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// PUT - Mettre à jour un projet
export const ProjectUpdate = (id, data) => {
  return http.put(`/projects/${id}`, data);
};

// PUT - Mettre à jour avec FormData
export const ProjectUpdateWithFormData = (id, formData) => {
  return http.put(`/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// DELETE - Supprimer un projet
export const ProjectDelete = (id) => {
  return http.delete(`/projects/${id}`);
};

// PUT - Changer le statut
export const ProjectUpdateStatus = (id, status) => {
  return http.put(`/projects/${id}/status`, { status });
};

// GET - Timeline d'un projet
export const ProjectGetTimeline = (id) => {
  return http.get(`/projects/${id}/timeline`);
};

// POST - Ajouter une étape au timeline
export const ProjectAddTimelineEvent = (id, data) => {
  return http.post(`/projects/${id}/timeline`, data);
};

// PUT - Mettre à jour une étape timeline
export const ProjectUpdateTimelineEvent = (projectId, eventId, data) => {
  return http.put(`/projects/${projectId}/timeline/${eventId}`, data);
};

// DELETE - Supprimer une étape timeline
export const ProjectDeleteTimelineEvent = (projectId, eventId) => {
  return http.delete(`/projects/${projectId}/timeline/${eventId}`);
};

// GET - Documents d'un projet
export const ProjectGetDocuments = (id) => {
  return http.get(`/projects/${id}/documents`);
};

// POST - Ajouter un document
export const ProjectAddDocument = (id, formData) => {
  return http.post(`/projects/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// DELETE - Supprimer un document
export const ProjectDeleteDocument = (projectId, documentId) => {
  return http.delete(`/projects/${projectId}/documents/${documentId}`);
};

// GET - Statistiques des projets
export const ProjectGetStats = () => {
  return http.get('/projects/stats');
};

// GET - Projets par province
export const ProjectListByProvince = (provinceId) => {
  return http.get(`/projects?province=${provinceId}`);
};

// GET - Projets par investisseur
export const ProjectListByInvestor = (investorId) => {
  return http.get(`/projects?investor=${investorId}`);
};

// GET - Projets par secteur
export const ProjectListBySector = (sector) => {
  return http.get(`/projects?sector=${sector}`);
};

// GET - Projets par statut
export const ProjectListByStatus = (status) => {
  return http.get(`/projects?status=${status}`);
};
