import http from '../../http-common';

// GET - Liste tous les projets
export const ProjectList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/investments${queryString ? `?${queryString}` : ''}`);
};

// GET - Recherche avec filtres
export const ProjectSearch = (search, status, sector, province) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (sector) params.append('sector', sector);
  if (province) params.append('province', province);
  return http.get(`/investments?${params.toString()}`);
};

// GET - Obtenir un projet par ID
export const ProjectGetById = (id) => {
  return http.get(`/investments/${id}`);
};

// POST - Créer un projet
export const ProjectCreate = (data) => {
  return http.post('/investments', data);
};

// POST - Créer avec FormData (images/documents)
export const ProjectCreateWithFormData = (formData) => {
  return http.post('/investments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// PUT - Mettre à jour un projet
export const ProjectUpdate = (id, data) => {
  return http.put(`/investments/${id}`, data);
};

// PUT - Mettre à jour avec FormData
export const ProjectUpdateWithFormData = (id, formData) => {
  return http.put(`/investments/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// DELETE - Supprimer un projet
export const ProjectDelete = (id) => {
  return http.delete(`/investments/${id}`);
};

// PUT - Changer le statut
export const ProjectUpdateStatus = (id, status) => {
  return http.put(`/investments/${id}/status`, { status });
};

// GET - Timeline d'un projet
export const ProjectGetTimeline = (id) => {
  return http.get(`/investments/${id}/timeline`);
};

// POST - Ajouter une étape au timeline
export const ProjectAddTimelineEvent = (id, data) => {
  return http.post(`/investments/${id}/timeline`, data);
};

// PUT - Mettre à jour une étape timeline
export const ProjectUpdateTimelineEvent = (projectId, eventId, data) => {
  return http.put(`/investments/${projectId}/timeline/${eventId}`, data);
};

// DELETE - Supprimer une étape timeline
export const ProjectDeleteTimelineEvent = (projectId, eventId) => {
  return http.delete(`/investments/${projectId}/timeline/${eventId}`);
};

// GET - Documents d'un projet
export const ProjectGetDocuments = (id) => {
  return http.get(`/investments/${id}/documents`);
};

// POST - Ajouter un document
export const ProjectAddDocument = (id, formData) => {
  return http.post(`/investments/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// DELETE - Supprimer un document
export const ProjectDeleteDocument = (projectId, documentId) => {
  return http.delete(`/investments/${projectId}/documents/${documentId}`);
};

// GET - Statistiques des projets
export const ProjectGetStats = () => {
  return http.get('/investments/stats');
};

// GET - Projets par province
export const ProjectListByProvince = (provinceId) => {
  return http.get(`/investments?province=${provinceId}`);
};

// GET - Projets par investisseur
export const ProjectListByInvestor = (investorId) => {
  return http.get(`/investments?investor=${investorId}`);
};

// GET - Projets par secteur
export const ProjectListBySector = (sector) => {
  return http.get(`/investments?sector=${sector}`);
};

// GET - Projets par statut
export const ProjectListByStatus = (status) => {
  return http.get(`/investments?status=${status}`);
};
