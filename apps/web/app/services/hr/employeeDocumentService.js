'use client';

import http from '../../http-common';

const getEndpoint = (employeeId) => `/hr-payroll/employees/${employeeId}/documents`;

// Types de documents avec leurs couleurs
export const DOCUMENT_TYPES = {
  cv: { value: 'cv', label: 'CV', color: '#2196f3', icon: 'description' },
  motivation: { value: 'motivation', label: 'Lettre de motivation', color: '#4caf50', icon: 'email' },
  sanction: { value: 'sanction', label: 'Sanction', color: '#f44336', icon: 'warning' },
  certification: { value: 'certification', label: 'Certification', color: '#ff9800', icon: 'school' },
  contrat: { value: 'contrat', label: 'Contrat', color: '#9c27b0', icon: 'assignment' },
  autre: { value: 'autre', label: 'Autre document', color: '#9e9e9e', icon: 'folder' }
};

// Recuperer la liste des documents d'un employe
export const getEmployeeDocuments = async (employeeId, params = {}) => {
  try {
    const { page = 1, limit = 50, type } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    if (type) queryParams.append('type', type);

    const response = await http.get(`${getEndpoint(employeeId)}?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.warn('Employee documents fetch failed:', error.message);
    return { success: false, data: { documents: [] } };
  }
};

// Recuperer les statistiques par type
export const getDocumentStats = async (employeeId) => {
  const response = await http.get(`${getEndpoint(employeeId)}/stats`);
  return response.data;
};

// Recuperer les types disponibles
export const getDocumentTypes = async (employeeId) => {
  const response = await http.get(`${getEndpoint(employeeId)}/types`);
  return response.data;
};

// Recuperer un document par ID
export const getDocumentById = async (employeeId, documentId) => {
  const response = await http.get(`${getEndpoint(employeeId)}/${documentId}`);
  return response.data;
};

// Uploader un nouveau document
export const uploadDocument = async (employeeId, file, metadata) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', metadata.title);
  formData.append('type', metadata.type);

  if (metadata.description) {
    formData.append('description', metadata.description);
  }
  if (metadata.documentDate) {
    formData.append('documentDate', metadata.documentDate);
  }
  if (metadata.expiryDate) {
    formData.append('expiryDate', metadata.expiryDate);
  }

  const response = await http.post(getEndpoint(employeeId), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Modifier les metadonnees d'un document
export const updateDocument = async (employeeId, documentId, data) => {
  const response = await http.put(`${getEndpoint(employeeId)}/${documentId}`, data);
  return response.data;
};

// Supprimer un document
export const deleteDocument = async (employeeId, documentId) => {
  const response = await http.delete(`${getEndpoint(employeeId)}/${documentId}`);
  return response.data;
};

// Archiver un document
export const archiveDocument = async (employeeId, documentId) => {
  const response = await http.patch(`${getEndpoint(employeeId)}/${documentId}/archive`);
  return response.data;
};

// Helper: Obtenir l'URL complete du fichier
export const getDocumentUrl = (filePath) => {
  if (!filePath) return null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4951/api/v1';
  const baseUrl = apiUrl.replace(/\/api\/v\d+|\/api/g, '');
  return `${baseUrl}${filePath}`;
};

// Helper: Obtenir l'URL de telechargement
export const getDownloadUrl = (employeeId, documentId) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4951/api/v1';
  return `${apiUrl}${getEndpoint(employeeId)}/${documentId}/download`;
};

// Helper: Obtenir le label francais du type
export const getDocumentTypeLabel = (type) => {
  return DOCUMENT_TYPES[type]?.label || 'Document';
};

// Helper: Obtenir la couleur du type
export const getTypeColor = (type) => {
  return DOCUMENT_TYPES[type]?.color || '#9e9e9e';
};

// Helper: Obtenir l'icone du type
export const getTypeIcon = (type) => {
  return DOCUMENT_TYPES[type]?.icon || 'folder';
};

// Helper: Formater la taille du fichier
export const formatFileSize = (bytes) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
};

// Helper: Verifier si le fichier est une image
export const isImageFile = (mimeType) => {
  return mimeType?.startsWith('image/');
};

// Helper: Verifier si le fichier est un PDF
export const isPdfFile = (mimeType) => {
  return mimeType === 'application/pdf';
};

// Helper: Verifier si le fichier peut etre previsualise
export const canPreview = (mimeType) => {
  return isImageFile(mimeType) || isPdfFile(mimeType);
};

export default {
  DOCUMENT_TYPES,
  getEmployeeDocuments,
  getDocumentStats,
  getDocumentTypes,
  getDocumentById,
  uploadDocument,
  updateDocument,
  deleteDocument,
  archiveDocument,
  getDocumentUrl,
  getDownloadUrl,
  getDocumentTypeLabel,
  getTypeColor,
  getTypeIcon,
  formatFileSize,
  isImageFile,
  isPdfFile,
  canPreview
};
