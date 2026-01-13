'use client';

import http from '../../http-common';

const ENDPOINT = '/hr/grades';

// Recuperer tous les grades
export const getGrades = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
  const queryString = new URLSearchParams(cleanParams).toString();
  const response = await http.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
  return response.data;
};

// Recuperer un grade par ID
export const getGradeById = async (id) => {
  const response = await http.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// Generer un nouveau code
export const generateGradeCode = async () => {
  const response = await http.get(`${ENDPOINT}/generate-code`);
  return response.data;
};

// Creer un grade
export const createGrade = async (data) => {
  const response = await http.post(ENDPOINT, data);
  return response.data;
};

// Mettre a jour un grade
export const updateGrade = async (id, data) => {
  const response = await http.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer un grade
export const deleteGrade = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

// Initialiser les grades par defaut
export const initDefaultGrades = async () => {
  const response = await http.post(`${ENDPOINT}/init`);
  return response.data;
};

export default {
  getGrades,
  getGradeById,
  generateGradeCode,
  createGrade,
  updateGrade,
  deleteGrade,
  initDefaultGrades,
};
