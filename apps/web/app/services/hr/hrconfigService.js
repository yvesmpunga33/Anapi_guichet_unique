'use client';

import http from '../../http-common';

const ENDPOINT = '/hr-payroll/hr-config';

// Recuperer toutes les configurations groupees par type
export const getAllConfigs = async (includeInactive = false) => {
  try {
    const params = includeInactive ? '?includeInactive=true' : '';
    const response = await http.get(`${ENDPOINT}${params}`);
    return response.data;
  } catch (error) {
    console.warn('HR Config fetch failed:', error.message);
    return { success: false, data: {} };
  }
};

// Recuperer les configurations par type
export const getConfigsByType = async (type, includeInactive = false) => {
  try {
    const params = includeInactive ? '?includeInactive=true' : '';
    const response = await http.get(`${ENDPOINT}/type/${type}${params}`);
    return response.data;
  } catch (error) {
    console.warn(`HR Config type ${type} fetch failed:`, error.message);
    return { success: false, data: [] };
  }
};

// Recuperer une configuration par ID
export const getConfigById = async (id) => {
  const response = await http.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// Creer une nouvelle configuration
export const createConfig = async (data) => {
  const response = await http.post(ENDPOINT, data);
  return response.data;
};

// Mettre a jour une configuration
export const updateConfig = async (id, data) => {
  const response = await http.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer une configuration
export const deleteConfig = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

// Reordonner les configurations
export const reorderConfigs = async (type, items) => {
  const response = await http.put(`${ENDPOINT}/reorder/${type}`, { items });
  return response.data;
};

// Initialiser les configurations par defaut
export const initDefaultConfigs = async () => {
  const response = await http.post(`${ENDPOINT}/init`);
  return response.data;
};

// Helper: Transformer les configs en options pour les selects
// useCodeAsValue: true pour les champs ENUM (type_contrat), false pour les autres
export const configsToOptions = (configs, useCodeAsValue = false) => {
  if (!configs || !Array.isArray(configs)) return [];
  return configs.map((config) => ({
    value: useCodeAsValue ? config.code : config.label,
    label: config.label,
    code: config.code,
    color: config.color,
    icon: config.icon,
    metadata: config.metadata,
  }));
};

// Types de configuration disponibles
export const CONFIG_TYPES = {
  DEPARTEMENT: 'departement',
  CATEGORIE: 'categorie',
  GRADE: 'grade',
  TYPE_CONTRAT: 'type_contrat',
  STATUT_EMPLOYE: 'statut_employe',
  BANQUE: 'banque',
  LIEN_PARENTE: 'lien_parente',
  POSTE: 'poste',
};

export default {
  getAllConfigs,
  getConfigsByType,
  getConfigById,
  createConfig,
  updateConfig,
  deleteConfig,
  reorderConfigs,
  initDefaultConfigs,
  configsToOptions,
  CONFIG_TYPES,
};
