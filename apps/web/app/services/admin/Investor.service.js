import http from '../../http-common';

// GET - Liste tous les investisseurs
export const InvestorList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/investors${queryString ? `?${queryString}` : ''}`);
};

// GET - Recherche avec filtres
export const InvestorSearch = (search, type, status) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (type) params.append('type', type);
  if (status) params.append('status', status);
  return http.get(`/investors?${params.toString()}`);
};

// GET - Obtenir un investisseur par ID
export const InvestorGetById = (id) => {
  return http.get(`/investors/${id}`);
};

// POST - Créer un investisseur
export const InvestorCreate = (data) => {
  return http.post('/investors', data);
};

// POST - Créer avec FormData (logo/documents)
export const InvestorCreateWithFormData = (formData) => {
  return http.post('/investors', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// PUT - Mettre à jour un investisseur
export const InvestorUpdate = (id, data) => {
  return http.put(`/investors/${id}`, data);
};

// PUT - Mettre à jour avec FormData
export const InvestorUpdateWithFormData = (id, formData) => {
  return http.put(`/investors/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// DELETE - Supprimer un investisseur
export const InvestorDelete = (id) => {
  return http.delete(`/investors/${id}`);
};

// GET - Projets d'un investisseur
export const InvestorGetProjects = (id) => {
  return http.get(`/investors/${id}/projects`);
};

// GET - Documents d'un investisseur
export const InvestorGetDocuments = (id) => {
  return http.get(`/investors/${id}/documents`);
};

// POST - Ajouter un document
export const InvestorAddDocument = (id, formData) => {
  return http.post(`/investors/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// DELETE - Supprimer un document
export const InvestorDeleteDocument = (investorId, documentId) => {
  return http.delete(`/investors/${investorId}/documents/${documentId}`);
};

// GET - Statistiques des investisseurs
export const InvestorGetStats = () => {
  return http.get('/investors/stats');
};

// PUT - Activer/Désactiver un investisseur
export const InvestorToggleStatus = (id, isActive) => {
  return http.put(`/investors/${id}/status`, { isActive });
};

// GET - Investisseurs par type
export const InvestorListByType = (type) => {
  return http.get(`/investors?type=${type}`);
};

// GET - Investisseurs par pays
export const InvestorListByCountry = (country) => {
  return http.get(`/investors?country=${country}`);
};
