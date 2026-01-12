import http from '../../http-common';

// ============ GENERAL CONFIG ============
export const ConfigGet = () => {
  return http.get('/config');
};

export const ConfigUpdate = (data) => {
  return http.put('/config', data);
};

export const ConfigGetByKey = (key) => {
  return http.get(`/config/${key}`);
};

export const ConfigSetByKey = (key, value) => {
  return http.put(`/config/${key}`, { value });
};

// ============ ACTES ADMINISTRATIFS ============
export const ActeAdministratifList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/config/actes-administratifs${queryString ? `?${queryString}` : ''}`);
};

export const ActeAdministratifGetById = (id) => {
  return http.get(`/config/actes-administratifs/${id}`);
};

export const ActeAdministratifCreate = (data) => {
  return http.post('/config/actes-administratifs', data);
};

export const ActeAdministratifUpdate = (id, data) => {
  return http.put(`/config/actes-administratifs/${id}`, data);
};

export const ActeAdministratifDelete = (id) => {
  return http.delete(`/config/actes-administratifs/${id}`);
};

// ============ MINISTRY WORKFLOWS ============
export const MinistryWorkflowList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/config/ministry-workflows${queryString ? `?${queryString}` : ''}`);
};

export const MinistryWorkflowGetById = (id) => {
  return http.get(`/config/ministry-workflows/${id}`);
};

export const MinistryWorkflowCreate = (data) => {
  return http.post('/config/ministry-workflows', data);
};

export const MinistryWorkflowUpdate = (id, data) => {
  return http.put(`/config/ministry-workflows/${id}`, data);
};

export const MinistryWorkflowDelete = (id) => {
  return http.delete(`/config/ministry-workflows/${id}`);
};

// ============ MINISTRY DEPARTMENTS ============
export const MinistryDepartmentList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/config/ministry-departments${queryString ? `?${queryString}` : ''}`);
};

export const MinistryDepartmentGetById = (id) => {
  return http.get(`/config/ministry-departments/${id}`);
};

export const MinistryDepartmentCreate = (data) => {
  return http.post('/config/ministry-departments', data);
};

export const MinistryDepartmentUpdate = (id, data) => {
  return http.put(`/config/ministry-departments/${id}`, data);
};

export const MinistryDepartmentDelete = (id) => {
  return http.delete(`/config/ministry-departments/${id}`);
};

// ============ CURRENCIES ============
export const CurrencyList = () => {
  return http.get('/currencies');
};

export const CurrencyGetById = (id) => {
  return http.get(`/currencies/${id}`);
};

export const CurrencyCreate = (data) => {
  return http.post('/currencies', data);
};

export const CurrencyUpdate = (id, data) => {
  return http.put(`/currencies/${id}`, data);
};

export const CurrencyDelete = (id) => {
  return http.delete(`/currencies/${id}`);
};

// ============ SETTINGS ============
export const SettingsGet = () => {
  return http.get('/admin/settings');
};

export const SettingsUpdate = (data) => {
  return http.put('/admin/settings', data);
};

// ============ WORKFLOW STEPS ============
export const WorkflowStepList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/config/workflow-steps${queryString ? `?${queryString}` : ''}`);
};

export const WorkflowStepCreate = (data) => {
  return http.post('/config/workflow-steps', data);
};

export const WorkflowStepUpdate = (id, data) => {
  return http.put(`/config/workflow-steps/${id}`, data);
};

export const WorkflowStepDelete = (id) => {
  return http.delete(`/config/workflow-steps/${id}`);
};

// ============ REQUIRED DOCUMENTS ============
export const RequiredDocumentList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/config/required-documents${queryString ? `?${queryString}` : ''}`);
};

export const RequiredDocumentCreate = (data) => {
  return http.post('/config/required-documents', data);
};

export const RequiredDocumentUpdate = (id, data) => {
  return http.put(`/config/required-documents/${id}`, data);
};

export const RequiredDocumentDelete = (id) => {
  return http.delete(`/config/required-documents/${id}`);
};
