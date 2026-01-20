import http from '../../http-common';

// ============ CONTRACTS ============
export const ContractList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/legal/contracts${queryString ? `?${queryString}` : ''}`);
};

export const ContractGetById = (id) => {
  return http.get(`/legal/contracts/${id}`);
};

export const ContractCreate = (data) => {
  return http.post('/legal/contracts', data);
};

export const ContractCreateWithFormData = (formData) => {
  return http.post('/legal/contracts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const ContractUpdate = (id, data) => {
  return http.put(`/legal/contracts/${id}`, data);
};

export const ContractUpdateWithFormData = (id, formData) => {
  return http.put(`/legal/contracts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const ContractDelete = (id) => {
  return http.delete(`/legal/contracts/${id}`);
};

export const ContractUpdateStatus = (id, status) => {
  return http.put(`/legal/contracts/${id}/status`, { status });
};

// ============ TEXTS (Textes juridiques) ============
export const LegalTextList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/legal/texts${queryString ? `?${queryString}` : ''}`);
};

export const LegalTextGetById = (id) => {
  return http.get(`/legal/texts/${id}`);
};

export const LegalTextCreate = (data) => {
  return http.post('/legal/texts', data);
};

export const LegalTextCreateWithFormData = (formData) => {
  return http.post('/legal/texts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const LegalTextUpdate = (id, data) => {
  return http.put(`/legal/texts/${id}`, data);
};

export const LegalTextDelete = (id) => {
  return http.delete(`/legal/texts/${id}`);
};

// ============ ALERTS ============
export const LegalAlertList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/legal/alerts${queryString ? `?${queryString}` : ''}`);
};

export const LegalAlertGetById = (id) => {
  return http.get(`/legal/alerts/${id}`);
};

export const LegalAlertCreate = (data) => {
  return http.post('/legal/alerts', data);
};

export const LegalAlertUpdate = (id, data) => {
  return http.put(`/legal/alerts/${id}`, data);
};

export const LegalAlertDelete = (id) => {
  return http.delete(`/legal/alerts/${id}`);
};

export const LegalAlertMarkAsRead = (id) => {
  return http.put(`/legal/alerts/${id}/read`);
};

// ============ DOCUMENT TYPES ============
export const DocumentTypeList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/legal/document-types${queryString ? `?${queryString}` : ''}`);
};

export const DocumentTypeGetById = (id) => {
  return http.get(`/legal/document-types/${id}`);
};

export const DocumentTypeCreate = (data) => {
  return http.post('/legal/document-types', data);
};

export const DocumentTypeUpdate = (id, data) => {
  return http.put(`/legal/document-types/${id}`, data);
};

export const DocumentTypeDelete = (id) => {
  return http.delete(`/legal/document-types/${id}`);
};

// ============ DOMAINS ============
export const LegalDomainList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/legal/domains${queryString ? `?${queryString}` : ''}`);
};

export const LegalDomainGetById = (id) => {
  return http.get(`/legal/domains/${id}`);
};

export const LegalDomainCreate = (data) => {
  return http.post('/legal/domains', data);
};

export const LegalDomainUpdate = (id, data) => {
  return http.put(`/legal/domains/${id}`, data);
};

export const LegalDomainDelete = (id) => {
  return http.delete(`/legal/domains/${id}`);
};

// ============ CONTRACT TYPES ============
export const ContractTypeList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/legal/contract-types${queryString ? `?${queryString}` : ''}`);
};

export const ContractTypeGetById = (id) => {
  return http.get(`/legal/contract-types/${id}`);
};

export const ContractTypeCreate = (data) => {
  return http.post('/legal/contract-types', data);
};

export const ContractTypeUpdate = (id, data) => {
  return http.put(`/legal/contract-types/${id}`, data);
};

export const ContractTypeDelete = (id) => {
  return http.delete(`/legal/contract-types/${id}`);
};

// ============ STATS & ANALYTICS ============
export const LegalStats = () => {
  return http.get('/legal/stats/dashboard');
};

export const LegalAnalytics = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/legal/analytics${queryString ? `?${queryString}` : ''}`);
};

// ============ ALERT GENERATION ============
export const LegalAlertGenerate = () => {
  return http.post('/legal/alerts/generate');
};

export const LegalAlertGenerateStats = () => {
  return http.get('/legal/alerts/generate');
};

// ============ CONTRACT RENEWAL ============
export const ContractRenewalInfo = (id) => {
  return http.get(`/legal/contracts/${id}/renew`);
};

export const ContractRenew = (id, data) => {
  return http.post(`/legal/contracts/${id}/renew`, data);
};

// ============ NOTIFICATIONS ============
export const LegalNotificationList = () => {
  return http.get('/legal/notifications');
};

export const LegalNotificationSend = (data) => {
  return http.post('/legal/notifications', data);
};
