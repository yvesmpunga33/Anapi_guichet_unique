import http from '../../http-common';

// ============ DOCUMENTS ============
export const DocumentList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/documents${queryString ? `?${queryString}` : ''}`);
};

export const DocumentGetById = (id) => {
  return http.get(`/documents/${id}`);
};

export const DocumentCreate = (formData) => {
  return http.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const DocumentUpdate = (id, data) => {
  return http.put(`/documents/${id}`, data);
};

export const DocumentDelete = (id) => {
  return http.delete(`/documents/${id}`);
};

export const DocumentDownload = (id) => {
  return http.get(`/documents/${id}/download`, {
    responseType: 'blob',
  });
};

export const DocumentGetByEntity = (entityType, entityId) => {
  return http.get(`/documents?entityType=${entityType}&entityId=${entityId}`);
};

// ============ UPLOADS ============
export const UploadFile = (formData) => {
  return http.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const UploadMultipleFiles = (formData) => {
  return http.post('/uploads/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const UploadImage = (formData) => {
  return http.post('/uploads/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const DeleteUploadedFile = (filename) => {
  return http.delete(`/uploads/${filename}`);
};

// ============ EXPORTS ============
export const ExportToExcel = (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/exports/excel/${endpoint}${queryString ? `?${queryString}` : ''}`, {
    responseType: 'blob',
  });
};

export const ExportToPDF = (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/exports/pdf/${endpoint}${queryString ? `?${queryString}` : ''}`, {
    responseType: 'blob',
  });
};

export const ExportToCSV = (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/exports/csv/${endpoint}${queryString ? `?${queryString}` : ''}`, {
    responseType: 'blob',
  });
};
