import http from '../../http-common';

// GET - Liste toutes les opportunités
export const OpportunityList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/opportunities${queryString ? `?${queryString}` : ''}`);
};

// GET - Opportunités publiques
export const OpportunityListPublic = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/public/opportunities${queryString ? `?${queryString}` : ''}`);
};

// GET - Recherche avec filtres
export const OpportunitySearch = (sector, province, status) => {
  const params = new URLSearchParams();
  if (sector) params.append('sector', sector);
  if (province) params.append('province', province);
  if (status) params.append('status', status);
  return http.get(`/opportunities?${params.toString()}`);
};

// GET - Obtenir une opportunité par ID
export const OpportunityGetById = (id) => {
  return http.get(`/opportunities/${id}`);
};

// POST - Créer une opportunité
export const OpportunityCreate = (data) => {
  return http.post('/opportunities', data);
};

// POST - Créer avec FormData (images)
export const OpportunityCreateWithFormData = (formData) => {
  return http.post('/opportunities', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// PUT - Mettre à jour une opportunité
export const OpportunityUpdate = (id, data) => {
  return http.put(`/opportunities/${id}`, data);
};

// DELETE - Supprimer une opportunité
export const OpportunityDelete = (id) => {
  return http.delete(`/opportunities/${id}`);
};

// PUT - Changer le statut
export const OpportunityUpdateStatus = (id, status) => {
  return http.put(`/opportunities/${id}/status`, { status });
};

// GET - Opportunités en vedette
export const OpportunityListFeatured = () => {
  return http.get('/opportunities?featured=true');
};

// GET - Statistiques des opportunités
export const OpportunityGetStats = () => {
  return http.get('/opportunities/stats');
};

// GET - Opportunités par province
export const OpportunityListByProvince = (provinceId) => {
  return http.get(`/opportunities?province=${provinceId}`);
};

// GET - Opportunités par secteur
export const OpportunityListBySector = (sector) => {
  return http.get(`/opportunities?sector=${sector}`);
};
