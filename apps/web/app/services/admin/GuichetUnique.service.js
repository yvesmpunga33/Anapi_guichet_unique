import http from '../../http-common';

// ============ DOSSIERS ============
export const DossierList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/guichet-unique/dossiers${queryString ? `?${queryString}` : ''}`);
};

export const DossierGetById = (id) => {
  return http.get(`/guichet-unique/dossiers/${id}`);
};

export const DossierCreate = (data) => {
  return http.post('/guichet-unique/dossiers', data);
};

export const DossierCreateWithFormData = (formData) => {
  return http.post('/guichet-unique/dossiers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const DossierUpdate = (id, data) => {
  return http.put(`/guichet-unique/dossiers/${id}`, data);
};

export const DossierDelete = (id) => {
  return http.delete(`/guichet-unique/dossiers/${id}`);
};

export const DossierUpdateStatus = (id, status) => {
  return http.put(`/guichet-unique/dossiers/${id}/status`, { status });
};

// ============ PERMIS ============
export const PermisList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/guichet-unique/permis${queryString ? `?${queryString}` : ''}`);
};

export const PermisGetById = (id) => {
  return http.get(`/guichet-unique/permis/${id}`);
};

export const PermisCreate = (data) => {
  return http.post('/guichet-unique/permis', data);
};

export const PermisUpdate = (id, data) => {
  return http.put(`/guichet-unique/permis/${id}`, data);
};

export const PermisDelete = (id) => {
  return http.delete(`/guichet-unique/permis/${id}`);
};

// ============ LICENCES ============
export const LicenceList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/guichet-unique/licences${queryString ? `?${queryString}` : ''}`);
};

export const LicenceGetById = (id) => {
  return http.get(`/guichet-unique/licences/${id}`);
};

export const LicenceCreate = (data) => {
  return http.post('/guichet-unique/licences', data);
};

export const LicenceUpdate = (id, data) => {
  return http.put(`/guichet-unique/licences/${id}`, data);
};

export const LicenceDelete = (id) => {
  return http.delete(`/guichet-unique/licences/${id}`);
};

// ============ AUTORISATIONS ============
export const AutorisationList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/guichet-unique/autorisations${queryString ? `?${queryString}` : ''}`);
};

export const AutorisationGetById = (id) => {
  return http.get(`/guichet-unique/autorisations/${id}`);
};

export const AutorisationCreate = (data) => {
  return http.post('/guichet-unique/autorisations', data);
};

export const AutorisationUpdate = (id, data) => {
  return http.put(`/guichet-unique/autorisations/${id}`, data);
};

export const AutorisationDelete = (id) => {
  return http.delete(`/guichet-unique/autorisations/${id}`);
};

// ============ AGREMENTS ============
export const AgrementList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/guichet-unique/agrements${queryString ? `?${queryString}` : ''}`);
};

export const AgrementGetById = (id) => {
  return http.get(`/guichet-unique/agrements/${id}`);
};

export const AgrementCreate = (data) => {
  return http.post('/guichet-unique/agrements', data);
};

export const AgrementUpdate = (id, data) => {
  return http.put(`/guichet-unique/agrements/${id}`, data);
};

export const AgrementDelete = (id) => {
  return http.delete(`/guichet-unique/agrements/${id}`);
};
