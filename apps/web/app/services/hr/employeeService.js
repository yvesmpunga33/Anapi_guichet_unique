'use client';

import http from '../../http-common';

const ENDPOINT = '/hr-payroll/employees';

// Recuperer la liste des employes avec pagination et filtres
export const getEmployees = async (params = {}) => {
  const { page = 1, limit = 10, search, departement, statut, typeContrat, sortBy, sortOrder } = params;

  const queryParams = new URLSearchParams();
  queryParams.append('page', page);
  queryParams.append('limit', limit);

  if (search) queryParams.append('search', search);
  if (departement) queryParams.append('departement', departement);
  if (statut) queryParams.append('statut', statut);
  if (typeContrat) queryParams.append('typeContrat', typeContrat);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (sortOrder) queryParams.append('sortOrder', sortOrder);

  const response = await http.get(`${ENDPOINT}?${queryParams.toString()}`);
  return response.data;
};

// Recuperer les statistiques des employes
export const getEmployeeStats = async () => {
  try {
    const response = await http.get(`${ENDPOINT}/statistics`);
    return response.data;
  } catch (error) {
    console.warn('Employee stats fetch failed:', error.message);
    return { success: false, data: { total: 0, actifs: 0, nouveaux: 0, enConge: 0 } };
  }
};

// Recuperer la liste des departements
export const getDepartements = async () => {
  const response = await http.get(`${ENDPOINT}/departements`);
  return response.data;
};

// Recuperer un employe par ID
export const getEmployeeById = async (id) => {
  const response = await http.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// Creer un nouvel employe
export const createEmployee = async (data) => {
  const response = await http.post(ENDPOINT, data);
  return response.data;
};

// Modifier un employe
export const updateEmployee = async (id, data) => {
  const response = await http.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer un employe
export const deleteEmployee = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

// Upload photo d'un employe
export const uploadEmployeePhoto = async (id, file) => {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await http.post(`${ENDPOINT}/${id}/photo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Supprimer la photo d'un employe
export const deleteEmployeePhoto = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}/photo`);
  return response.data;
};

// Helper pour construire l'URL complete de la photo
export const getPhotoUrl = (photoPath) => {
  if (!photoPath) return null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3502/api/v1';
  // Enlever /api/v1 ou /api de l'URL pour les images statiques
  const baseUrl = apiUrl.replace(/\/api\/v\d+|\/api/g, '');
  return `${baseUrl}${photoPath}`;
};

export default {
  getEmployees,
  getEmployeeStats,
  getDepartements,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  uploadEmployeePhoto,
  deleteEmployeePhoto,
  getPhotoUrl,
};
