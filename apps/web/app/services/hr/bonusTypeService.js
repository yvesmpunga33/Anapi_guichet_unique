'use client';

import http from '../../http-common';

const ENDPOINT = '/hr-payroll/bonus-types';

// Recuperer la liste des types de primes
export const getBonusTypes = async (params = {}) => {
  const { page = 1, limit = 50, search, actif } = params;

  const queryParams = new URLSearchParams();
  queryParams.append('page', page);
  queryParams.append('limit', limit);

  if (search) queryParams.append('search', search);
  if (actif !== undefined) queryParams.append('actif', actif);

  const response = await http.get(`${ENDPOINT}?${queryParams.toString()}`);
  return response.data;
};

// Recuperer un type de prime par ID
export const getBonusTypeById = async (id) => {
  const response = await http.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// Creer un nouveau type de prime
export const createBonusType = async (data) => {
  const response = await http.post(ENDPOINT, data);
  return response.data;
};

// Modifier un type de prime
export const updateBonusType = async (id, data) => {
  const response = await http.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer un type de prime
export const deleteBonusType = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

// Activer/Desactiver un type de prime
export const toggleBonusTypeStatus = async (id) => {
  const response = await http.patch(`${ENDPOINT}/${id}/toggle-status`);
  return response.data;
};

// Generer un nouveau code
export const generateBonusTypeCode = async () => {
  const response = await http.get(`${ENDPOINT}/generate-code`);
  return response.data;
};

// Initialiser les types par defaut
export const initDefaultBonusTypes = async () => {
  const response = await http.post(`${ENDPOINT}/init`);
  return response.data;
};

export default {
  getBonusTypes,
  getBonusTypeById,
  createBonusType,
  updateBonusType,
  deleteBonusType,
  toggleBonusTypeStatus,
  generateBonusTypeCode,
  initDefaultBonusTypes,
};
