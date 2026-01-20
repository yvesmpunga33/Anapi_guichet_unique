'use client';

import http from '../../http-common';

const ENDPOINT = '/hr-payroll/bonuses';

// Recuperer toutes les primes
export const getBonuses = async (params = {}) => {
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

// Statistiques des primes
export const getBonusStats = async (annee, enterpriseId = null) => {
  const queryParams = new URLSearchParams();
  if (annee) queryParams.append('annee', annee);
  if (enterpriseId) queryParams.append('enterpriseId', enterpriseId);

  const response = await http.get(`${ENDPOINT}/stats?${queryParams.toString()}`);
  return response.data;
};

// Recuperer une prime par ID
export const getBonusById = async (id) => {
  const response = await http.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// Generer une reference unique
export const generateBonusReference = async (annee) => {
  const queryParams = annee ? `?annee=${annee}` : '';
  const response = await http.get(`${ENDPOINT}/generate-reference${queryParams}`);
  return response.data;
};

// Alias pour compatibilite
export const generateReference = generateBonusReference;

// Creer une prime
export const createBonus = async (data) => {
  const response = await http.post(ENDPOINT, data);
  return response.data;
};

// Modifier une prime
export const updateBonus = async (id, data) => {
  const response = await http.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer une prime
export const deleteBonus = async (id) => {
  const response = await http.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

// Activer/Desactiver une prime
export const toggleBonusStatus = async (id) => {
  const response = await http.patch(`${ENDPOINT}/${id}/toggle`);
  return response.data;
};

// Types de primes
export const BONUS_TYPES = {
  fixe: 'Montant fixe',
  pourcentage: 'Pourcentage'
};

// Frequences
export const BONUS_FREQUENCIES = {
  unique: 'Unique (1 mois)',
  periode: 'Periode'
};

// Obtenir le label du type
export const getBonusTypeLabel = (type) => {
  return BONUS_TYPES[type] || type;
};

// Obtenir le label de la frequence
export const getBonusFrequenceLabel = (frequence) => {
  return BONUS_FREQUENCIES[frequence] || frequence;
};

// Alias pour compatibilite
export const getFrequenceLabel = getBonusFrequenceLabel;

// Formater le montant
export const formatBonusAmount = (bonus) => {
  if (!bonus) return '-';

  const amount = parseFloat(bonus.montant);
  if (bonus.type === 'pourcentage') {
    return `${amount.toFixed(1)}%`;
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'CDF',
    minimumFractionDigits: 0
  }).format(amount);
};

// Formater la periode
export const formatBonusPeriod = (bonus, getMonthName) => {
  if (!bonus) return '-';

  if (bonus.frequence === 'unique') {
    const monthName = getMonthName ? getMonthName(bonus.moisDebut) : `Mois ${bonus.moisDebut}`;
    return `${monthName} ${bonus.annee}`;
  }

  const startMonth = getMonthName ? getMonthName(bonus.moisDebut) : `Mois ${bonus.moisDebut}`;
  const endMonth = getMonthName ? getMonthName(bonus.moisFin || 12) : `Mois ${bonus.moisFin || 12}`;

  return `${startMonth} - ${endMonth} ${bonus.annee}`;
};

export default {
  getBonuses,
  getBonusStats,
  getBonusById,
  generateBonusReference,
  generateReference, // Alias
  createBonus,
  updateBonus,
  deleteBonus,
  toggleBonusStatus,
  BONUS_TYPES,
  BONUS_FREQUENCIES,
  getBonusTypeLabel,
  getBonusFrequenceLabel,
  getFrequenceLabel, // Alias
  formatBonusAmount,
  formatBonusPeriod
};
