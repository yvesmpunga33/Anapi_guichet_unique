'use client';

import http from '../../http-common';

const TYPE_ENDPOINT = '/attendance-types';
const CONFIG_ENDPOINT = '/attendance-configs';

// ==========================================
// TYPES DE POINTAGE
// ==========================================

// Obtenir tous les types
export const getAttendanceTypes = async (params = {}) => {
  const { actif, includeConfigs } = params;
  const queryParams = new URLSearchParams();
  if (actif !== undefined) queryParams.append('actif', actif);
  if (includeConfigs) queryParams.append('includeConfigs', 'true');

  const response = await http.get(`${TYPE_ENDPOINT}?${queryParams.toString()}`);
  return response.data;
};

// Obtenir un type par ID
export const getAttendanceTypeById = async (id) => {
  const response = await http.get(`${TYPE_ENDPOINT}/${id}`);
  return response.data;
};

// Creer un type
export const createAttendanceType = async (data) => {
  const response = await http.post(TYPE_ENDPOINT, data);
  return response.data;
};

// Modifier un type
export const updateAttendanceType = async (id, data) => {
  const response = await http.put(`${TYPE_ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer un type
export const deleteAttendanceType = async (id) => {
  const response = await http.delete(`${TYPE_ENDPOINT}/${id}`);
  return response.data;
};

// Obtenir les types par defaut (template)
export const getDefaultTypes = async () => {
  const response = await http.get(`${TYPE_ENDPOINT}/defaults`);
  return response.data;
};

// Initialiser les types par defaut
export const seedDefaultTypes = async () => {
  const response = await http.post(`${TYPE_ENDPOINT}/seed`);
  return response.data;
};

// Reordonner les types
export const reorderTypes = async (order) => {
  const response = await http.put(`${TYPE_ENDPOINT}/reorder`, { order });
  return response.data;
};

// ==========================================
// CONFIGURATIONS DE POINTAGE
// ==========================================

// Obtenir toutes les configurations
export const getAttendanceConfigs = async (params = {}) => {
  const { attendanceTypeId, actif, categoryId } = params;
  const queryParams = new URLSearchParams();
  if (attendanceTypeId) queryParams.append('attendanceTypeId', attendanceTypeId);
  if (actif !== undefined) queryParams.append('actif', actif);
  if (categoryId) queryParams.append('categoryId', categoryId);

  const response = await http.get(`${CONFIG_ENDPOINT}?${queryParams.toString()}`);
  return response.data;
};

// Obtenir une configuration par ID
export const getAttendanceConfigById = async (id) => {
  const response = await http.get(`${CONFIG_ENDPOINT}/${id}`);
  return response.data;
};

// Creer une configuration
export const createAttendanceConfig = async (data) => {
  const response = await http.post(CONFIG_ENDPOINT, data);
  return response.data;
};

// Modifier une configuration
export const updateAttendanceConfig = async (id, data) => {
  const response = await http.put(`${CONFIG_ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer une configuration
export const deleteAttendanceConfig = async (id) => {
  const response = await http.delete(`${CONFIG_ENDPOINT}/${id}`);
  return response.data;
};

// Obtenir la configuration applicable pour un employe
export const getConfigForEmployee = async (employeeId, attendanceTypeId, date = null) => {
  const queryParams = new URLSearchParams();
  queryParams.append('employeeId', employeeId);
  queryParams.append('attendanceTypeId', attendanceTypeId);
  if (date) queryParams.append('date', date);

  const response = await http.get(`${CONFIG_ENDPOINT}/for-employee?${queryParams.toString()}`);
  return response.data;
};

// Obtenir les configurations du jour
export const getTodayConfigs = async () => {
  const response = await http.get(`${CONFIG_ENDPOINT}/today`);
  return response.data;
};

// ==========================================
// CONSTANTES
// ==========================================

export const CATEGORY_MODES = {
  all: { value: 'all', label: 'Toutes les categories' },
  include: { value: 'include', label: 'Seulement certaines categories' },
  exclude: { value: 'exclude', label: 'Toutes sauf certaines categories' }
};

export const DEPARTMENT_MODES = {
  all: { value: 'all', label: 'Tous les departements' },
  include: { value: 'include', label: 'Seulement certains departements' },
  exclude: { value: 'exclude', label: 'Tous sauf certains departements' }
};

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Dimanche', short: 'Dim' },
  { value: 1, label: 'Lundi', short: 'Lun' },
  { value: 2, label: 'Mardi', short: 'Mar' },
  { value: 3, label: 'Mercredi', short: 'Mer' },
  { value: 4, label: 'Jeudi', short: 'Jeu' },
  { value: 5, label: 'Vendredi', short: 'Ven' },
  { value: 6, label: 'Samedi', short: 'Sam' }
];

export const DEFAULT_ICONS = [
  { value: 'login', label: 'Entree' },
  { value: 'logout', label: 'Sortie' },
  { value: 'free_breakfast', label: 'Pause cafe' },
  { value: 'restaurant', label: 'Dejeuner' },
  { value: 'schedule', label: 'Horaire' },
  { value: 'more_time', label: 'Heures sup' },
  { value: 'timer_off', label: 'Fin heures sup' },
  { value: 'meeting_room', label: 'Reunion' },
  { value: 'work', label: 'Travail' },
  { value: 'home', label: 'Teletravail' }
];

export const DEFAULT_COLORS = [
  { value: '#4caf50', label: 'Vert' },
  { value: '#2196f3', label: 'Bleu' },
  { value: '#ff9800', label: 'Orange' },
  { value: '#f44336', label: 'Rouge' },
  { value: '#9c27b0', label: 'Violet' },
  { value: '#673ab7', label: 'Indigo' },
  { value: '#00bcd4', label: 'Cyan' },
  { value: '#795548', label: 'Marron' },
  { value: '#607d8b', label: 'Gris' },
  { value: '#e91e63', label: 'Rose' }
];

export default {
  // Types
  getAttendanceTypes,
  getAttendanceTypeById,
  createAttendanceType,
  updateAttendanceType,
  deleteAttendanceType,
  getDefaultTypes,
  seedDefaultTypes,
  reorderTypes,

  // Configs
  getAttendanceConfigs,
  getAttendanceConfigById,
  createAttendanceConfig,
  updateAttendanceConfig,
  deleteAttendanceConfig,
  getConfigForEmployee,
  getTodayConfigs,

  // Constantes
  CATEGORY_MODES,
  DEPARTMENT_MODES,
  DAYS_OF_WEEK,
  DEFAULT_ICONS,
  DEFAULT_COLORS
};
