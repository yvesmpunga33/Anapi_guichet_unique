'use client';

import http from '../../http-common';

const ENDPOINT = '/hr-payroll/deduction-types';

// Recuperer la liste des types de reductions
export const getDeductionTypes = async (params = {}) => {
  const { page = 1, limit = 50, search, actif } = params;

  const queryParams = new URLSearchParams();
  queryParams.append('page', page);
  queryParams.append('limit', limit);

  if (search) queryParams.append('search', search);
  if (actif !== undefined) queryParams.append('actif', actif);

  const response = await http.get(`${ENDPOINT}?${queryParams.toString()}`);
  return response.data;
};

// Recuperer un type de reduction par ID
export const getDeductionTypeById = async (id) => {
  const response = await http.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// Creer un nouveau type de reduction
export const createDeductionType = async (data) => {
  const response = await http.post(ENDPOINT, data);
  return response.data;
};

// Modifier un type de reduction
export const updateDeductionType = async (id, data) => {
  const response = await http.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer un type de reduction
export const deleteDeductionType = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

// Activer/Desactiver un type de reduction
export const toggleDeductionTypeStatus = async (id) => {
  const response = await http.patch(`${ENDPOINT}/${id}/toggle-status`);
  return response.data;
};

// Generer un nouveau code
export const generateDeductionTypeCode = async () => {
  const response = await http.get(`${ENDPOINT}/generate-code`);
  return response.data;
};

// Initialiser les types par defaut
export const initDefaultDeductionTypes = async () => {
  const response = await http.post(`${ENDPOINT}/init`);
  return response.data;
};

export default {
  getDeductionTypes,
  getDeductionTypeById,
  createDeductionType,
  updateDeductionType,
  deleteDeductionType,
  toggleDeductionTypeStatus,
  generateDeductionTypeCode,
  initDefaultDeductionTypes,
};
