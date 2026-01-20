'use client';

import http from '../../http-common';

const ENDPOINT = '/hr-payroll/departments';

// Recuperer tous les departements
export const getDepartments = async (params = {}) => {
  try {
    // Filtrer les valeurs undefined et null avant de creer les parametres
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const response = await http.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
    return response.data;
  } catch (error) {
    console.warn('Departments fetch failed:', error.message);
    return { success: false, data: { departments: [] } };
  }
};

// Recuperer un departement par ID
export const getDepartmentById = async (id) => {
  const response = await http.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// Generer un nouveau code
export const generateDepartmentCode = async () => {
  const response = await http.get(`${ENDPOINT}/generate-code`);
  return response.data;
};

// Creer un departement
export const createDepartment = async (data) => {
  const response = await http.post(ENDPOINT, data);
  return response.data;
};

// Mettre a jour un departement
export const updateDepartment = async (id, data) => {
  const response = await http.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer un departement
export const deleteDepartment = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

// Initialiser les departements par defaut
export const initDefaultDepartments = async () => {
  const response = await http.post(`${ENDPOINT}/init`);
  return response.data;
};

export default {
  getDepartments,
  getDepartmentById,
  generateDepartmentCode,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  initDefaultDepartments,
};
