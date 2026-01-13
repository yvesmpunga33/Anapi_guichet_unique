'use client';

import http from '../../http-common';

const ENDPOINT = '/hr/positions';

// Recuperer tous les postes
export const getPositions = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
  const queryString = new URLSearchParams(cleanParams).toString();
  const response = await http.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

// Recuperer un poste par ID
export const getPositionById = async (id) => {
  const response = await http.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// Generer un nouveau code
export const generatePositionCode = async () => {
  const response = await http.get(`${ENDPOINT}/generate-code`);
  return response.data;
};

// Creer un poste
export const createPosition = async (data) => {
  const response = await http.post(ENDPOINT, data);
  return response.data;
};

// Mettre a jour un poste
export const updatePosition = async (id, data) => {
  const response = await http.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer un poste
export const deletePosition = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

// Initialiser les postes par defaut
export const initDefaultPositions = async () => {
  const response = await http.post(`${ENDPOINT}/init`);
  return response.data;
};

export default {
  getPositions,
  getPositionById,
  generatePositionCode,
  createPosition,
  updatePosition,
  deletePosition,
  initDefaultPositions,
};
