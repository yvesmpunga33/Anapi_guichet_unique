'use client';

import http from '../../http-common';

const ENDPOINT = '/hr-payroll/currencies';

// Recuperer toutes les devises
export const getCurrencies = async (params = {}) => {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const response = await http.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
    return response.data;
  } catch (error) {
    console.warn('Currencies fetch failed:', error.message);
    return { success: false, data: { currencies: [] } };
  }
};

// Recuperer une devise par ID
export const getCurrencyById = async (id) => {
  const response = await http.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// Creer une devise
export const createCurrency = async (data) => {
  const response = await http.post(ENDPOINT, data);
  return response.data;
};

// Mettre a jour une devise
export const updateCurrency = async (id, data) => {
  const response = await http.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer une devise
export const deleteCurrency = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

export default {
  getCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
};
