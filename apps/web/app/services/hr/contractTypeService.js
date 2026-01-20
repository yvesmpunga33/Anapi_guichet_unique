'use client';

import http from '../../http-common';

const ENDPOINT = '/hr-payroll/contract-types';

// Recuperer tous les types de contrat avec pagination et filtres
export const getContractTypes = async (params = {}) => {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const response = await http.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
    return response.data;
  } catch (error) {
    console.warn('Contract types fetch failed:', error.message);
    return { success: false, data: { contractTypes: [] } };
  }
};

// Recuperer un type de contrat par ID
export const getContractTypeById = async (id) => {
  const response = await http.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// Creer un nouveau type de contrat
export const createContractType = async (data) => {
  const response = await http.post(ENDPOINT, data);
  return response.data;
};

// Mettre a jour un type de contrat
export const updateContractType = async (id, data) => {
  const response = await http.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer un type de contrat
export const deleteContractType = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

export default {
  getContractTypes,
  getContractTypeById,
  createContractType,
  updateContractType,
  deleteContractType,
};
