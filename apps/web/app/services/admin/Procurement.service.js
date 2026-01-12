import http from '../../http-common';

// ============ TENDERS (Appels d'offres) ============
export const TenderList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/procurement/tenders${queryString ? `?${queryString}` : ''}`);
};

export const TenderGetById = (id) => {
  return http.get(`/procurement/tenders/${id}`);
};

export const TenderCreate = (data) => {
  return http.post('/procurement/tenders', data);
};

export const TenderCreateWithFormData = (formData) => {
  return http.post('/procurement/tenders', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const TenderUpdate = (id, data) => {
  return http.put(`/procurement/tenders/${id}`, data);
};

export const TenderDelete = (id) => {
  return http.delete(`/procurement/tenders/${id}`);
};

export const TenderUpdateStatus = (id, status) => {
  return http.put(`/procurement/tenders/${id}/status`, { status });
};

export const TenderGetBids = (id) => {
  return http.get(`/procurement/tenders/${id}/bids`);
};

// ============ CONTRACTS (Marchés) ============
export const ProcurementContractList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/procurement/contracts${queryString ? `?${queryString}` : ''}`);
};

export const ProcurementContractGetById = (id) => {
  return http.get(`/procurement/contracts/${id}`);
};

export const ProcurementContractCreate = (data) => {
  return http.post('/procurement/contracts', data);
};

export const ProcurementContractUpdate = (id, data) => {
  return http.put(`/procurement/contracts/${id}`, data);
};

export const ProcurementContractDelete = (id) => {
  return http.delete(`/procurement/contracts/${id}`);
};

// ============ SUPPLIERS (Fournisseurs) ============
export const SupplierList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/procurement/suppliers${queryString ? `?${queryString}` : ''}`);
};

export const SupplierGetById = (id) => {
  return http.get(`/procurement/suppliers/${id}`);
};

export const SupplierCreate = (data) => {
  return http.post('/procurement/suppliers', data);
};

export const SupplierUpdate = (id, data) => {
  return http.put(`/procurement/suppliers/${id}`, data);
};

export const SupplierDelete = (id) => {
  return http.delete(`/procurement/suppliers/${id}`);
};

// ============ BIDS (Soumissions) ============
export const BidList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/procurement/bids${queryString ? `?${queryString}` : ''}`);
};

export const BidGetById = (id) => {
  return http.get(`/procurement/bids/${id}`);
};

export const BidCreate = (data) => {
  return http.post('/procurement/bids', data);
};

export const BidCreateWithFormData = (formData) => {
  return http.post('/procurement/bids', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const BidUpdate = (id, data) => {
  return http.put(`/procurement/bids/${id}`, data);
};

export const BidDelete = (id) => {
  return http.delete(`/procurement/bids/${id}`);
};

export const BidUpdateStatus = (id, status) => {
  return http.put(`/procurement/bids/${id}/status`, { status });
};

// ============ EVALUATIONS ============
export const EvaluationList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/procurement/evaluations${queryString ? `?${queryString}` : ''}`);
};

export const EvaluationGetById = (id) => {
  return http.get(`/procurement/evaluations/${id}`);
};

export const EvaluationCreate = (data) => {
  return http.post('/procurement/evaluations', data);
};

export const EvaluationUpdate = (id, data) => {
  return http.put(`/procurement/evaluations/${id}`, data);
};

// ============ CONFIG ============
export const ProcurementCategoryList = () => {
  return http.get('/procurement/config/categories');
};

export const ProcurementSectorList = () => {
  return http.get('/procurement/config/sectors');
};

export const ProcurementTypeList = () => {
  return http.get('/procurement/config/types');
};

// ============ STATS ============
export const ProcurementGetStats = () => {
  return http.get('/procurement/stats');
};

// ============ BIDDERS (Soumissionnaires) ============
export const BidderList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/procurement/bidders${queryString ? `?${queryString}` : ''}`);
};

export const BidderGetById = (id) => {
  return http.get(`/procurement/bidders/${id}`);
};

export const BidderCreate = (data) => {
  return http.post('/procurement/bidders', data);
};

export const BidderCreateWithFormData = (formData) => {
  return http.post('/procurement/bidders', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const BidderUpdate = (id, data) => {
  return http.put(`/procurement/bidders/${id}`, data);
};

export const BidderUpdateWithFormData = (id, formData) => {
  return http.put(`/procurement/bidders/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const BidderDelete = (id) => {
  return http.delete(`/procurement/bidders/${id}`);
};

// ============ CERTIFICATES ============
export const CertificateList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/procurement/certificates${queryString ? `?${queryString}` : ''}`);
};

export const CertificateGetById = (id) => {
  return http.get(`/procurement/certificates/${id}`);
};

export const CertificateCreate = (data) => {
  return http.post('/procurement/certificates', data);
};

export const CertificateUpdate = (id, data) => {
  return http.put(`/procurement/certificates/${id}`, data);
};

export const CertificateDelete = (id) => {
  return http.delete(`/procurement/certificates/${id}`);
};

// ============ SECTORS CONFIG ============
export const SectorList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/procurement/sectors${queryString ? `?${queryString}` : ''}`);
};

export const SectorCreate = (data) => {
  return http.post('/procurement/sectors', data);
};

export const SectorUpdate = (id, data) => {
  return http.put(`/procurement/sectors/${id}`, data);
};

export const SectorDelete = (id) => {
  return http.delete(`/procurement/sectors/${id}`);
};

// ============ TENDER UPDATE WITH FORMDATA ============
export const TenderUpdateWithFormData = (id, formData) => {
  return http.put(`/procurement/tenders/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ============ BID UPDATE WITH FORMDATA ============
export const BidUpdateWithFormData = (id, formData) => {
  return http.put(`/procurement/bids/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ============ CONTRACT WITH FORMDATA ============
export const ProcurementContractCreateWithFormData = (formData) => {
  return http.post('/procurement/contracts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const ProcurementContractUpdateWithFormData = (id, formData) => {
  return http.put(`/procurement/contracts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ============ DASHBOARD ============
export const ProcurementDashboard = (year) => {
  return http.get(`/procurement/dashboard?year=${year}`);
};

// ============ DOCUMENT TYPES ============
export const DocumentTypeList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/procurement/document-types${queryString ? `?${queryString}` : ''}`);
};

export const DocumentTypeCreate = (data) => {
  return http.post('/procurement/document-types', data);
};

export const DocumentTypeUpdate = (id, data) => {
  return http.put(`/procurement/document-types/${id}`, data);
};

export const DocumentTypeDelete = (id) => {
  return http.delete(`/procurement/document-types/${id}`);
};

// ============ REFERENTIELS SECTORS ============
export const ReferentielSectorList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/referentiels/sectors${queryString ? `?${queryString}` : ''}`);
};

export const ReferentielSectorCreate = (data) => {
  return http.post('/referentiels/sectors', data);
};

export const ReferentielSectorUpdate = (data) => {
  return http.put('/referentiels/sectors', data);
};

export const ReferentielSectorDelete = (id) => {
  return http.delete(`/referentiels/sectors?id=${id}`);
};
