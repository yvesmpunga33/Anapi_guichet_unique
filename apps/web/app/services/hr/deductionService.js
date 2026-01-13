'use client';

import http from '../../http-common';

const ENDPOINT = '/hr/deductions';

// Recuperer toutes les reductions
export const getDeductions = async (params = {}) => {
  const {
    page = 1,
    limit = 50,
    search,
    annee,
    mois,
    employeeId,
    categoryId,
    type,
    frequence,
    actif,
    enterpriseId
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append('page', page);
  queryParams.append('limit', limit);

  if (search) queryParams.append('search', search);
  if (annee) queryParams.append('annee', annee);
  if (mois) queryParams.append('mois', mois);
  if (employeeId) queryParams.append('employeeId', employeeId);
  if (categoryId) queryParams.append('categoryId', categoryId);
  if (type) queryParams.append('type', type);
  if (frequence) queryParams.append('frequence', frequence);
  if (actif !== undefined) queryParams.append('actif', actif);
  if (enterpriseId) queryParams.append('enterpriseId', enterpriseId);

  const response = await http.get(`${ENDPOINT}?${queryParams.toString()}`);
  return response.data;
};

// Statistiques des reductions
export const getDeductionStats = async (annee, enterpriseId = null) => {
  const queryParams = new URLSearchParams();
  if (annee) queryParams.append('annee', annee);
  if (enterpriseId) queryParams.append('enterpriseId', enterpriseId);

  const response = await http.get(`${ENDPOINT}/stats?${queryParams.toString()}`);
  return response.data;
};

// Recuperer une reduction par ID
export const getDeductionById = async (id) => {
  const response = await http.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// Generer une reference unique
export const generateReference = async (annee) => {
  const queryParams = annee ? `?annee=${annee}` : '';
  const response = await http.get(`${ENDPOINT}/generate-reference${queryParams}`);
  return response.data;
};

// Creer une reduction
export const createDeduction = async (data) => {
  const response = await http.post(ENDPOINT, data);
  return response.data;
};

// Modifier une reduction
export const updateDeduction = async (id, data) => {
  const response = await http.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer une reduction
export const deleteDeduction = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

// Activer/Desactiver une reduction
export const toggleDeductionStatus = async (id) => {
  const response = await http.patch(`${ENDPOINT}/${id}/toggle`);
  return response.data;
};

// Types de reductions
export const DEDUCTION_TYPES = {
  fixe: 'Montant fixe',
  pourcentage: 'Pourcentage'
};

// Frequences
export const DEDUCTION_FREQUENCIES = {
  unique: 'Unique (1 mois)',
  periode: 'Periode'
};

// Obtenir le label du type
export const getTypeLabel = (type) => {
  return DEDUCTION_TYPES[type] || type;
};

// Obtenir le label de la frequence
export const getFrequenceLabel = (frequence) => {
  return DEDUCTION_FREQUENCIES[frequence] || frequence;
};

// Formater le montant
export const formatDeductionAmount = (deduction) => {
  if (!deduction) return '-';

  const amount = parseFloat(deduction.montant);
  if (deduction.type === 'pourcentage') {
    return `${amount.toFixed(1)}%`;
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'CDF',
    minimumFractionDigits: 0
  }).format(amount);
};

// Formater la periode
export const formatDeductionPeriod = (deduction, getMonthName) => {
  if (!deduction) return '-';

  if (deduction.frequence === 'unique') {
    const monthName = getMonthName ? getMonthName(deduction.moisDebut) : `Mois ${deduction.moisDebut}`;
    return `${monthName} ${deduction.annee}`;
  }

  const startMonth = getMonthName ? getMonthName(deduction.moisDebut) : `Mois ${deduction.moisDebut}`;
  const endMonth = getMonthName ? getMonthName(deduction.moisFin || 12) : `Mois ${deduction.moisFin || 12}`;

  return `${startMonth} - ${endMonth} ${deduction.annee}`;
};

export default {
  getDeductions,
  getDeductionStats,
  getDeductionById,
  generateReference,
  createDeduction,
  updateDeduction,
  deleteDeduction,
  toggleDeductionStatus,
  DEDUCTION_TYPES,
  DEDUCTION_FREQUENCIES,
  getTypeLabel,
  getFrequenceLabel,
  formatDeductionAmount,
  formatDeductionPeriod
};
