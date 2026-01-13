'use client';

import http from '../../http-common';

const ENDPOINT = '/hr/categories';

// Recuperer toutes les categories
export const getCategories = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await http.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

// Recuperer une categorie par ID
export const getCategoryById = async (id) => {
  const response = await http.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// Generer un nouveau code
export const generateCode = async () => {
  const response = await http.get(`${ENDPOINT}/generate-code`);
  return response.data;
};

// Creer une categorie
export const createCategory = async (data) => {
  const response = await http.post(ENDPOINT, data);
  return response.data;
};

// Mettre a jour une categorie
export const updateCategory = async (id, data) => {
  const response = await http.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer une categorie
export const deleteCategory = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

// Activer/Desactiver une categorie
export const toggleCategoryStatus = async (id) => {
  const response = await http.patch(`${ENDPOINT}/${id}/toggle-status`);
  return response.data;
};

export default {
  getCategories,
  getCategoryById,
  generateCode,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
};
