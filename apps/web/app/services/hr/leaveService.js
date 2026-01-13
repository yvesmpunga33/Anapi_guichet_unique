'use client';

import http from '../../http-common';

// ============================================
// TYPES DE CONGES
// ============================================

const LEAVE_TYPES_ENDPOINT = '/leave-types';

// Recuperer tous les types de conges
export const getLeaveTypes = async (params = {}) => {
  const { page = 1, limit = 50, search, actif, genreApplicable } = params;
  const queryParams = new URLSearchParams();

  queryParams.append('page', page);
  queryParams.append('limit', limit);

  if (search) queryParams.append('search', search);
  if (actif !== undefined) queryParams.append('actif', actif);
  if (genreApplicable) queryParams.append('genreApplicable', genreApplicable);

  const response = await http.get(`${LEAVE_TYPES_ENDPOINT}?${queryParams.toString()}`);
  return response.data;
};

// Recuperer un type de conge par ID
export const getLeaveTypeById = async (id) => {
  const response = await http.get(`${LEAVE_TYPES_ENDPOINT}/${id}`);
  return response.data;
};

// Generer un code unique pour type de conge
export const generateLeaveTypeCode = async () => {
  const response = await http.get(`${LEAVE_TYPES_ENDPOINT}/generate-code`);
  return response.data;
};

// Creer un type de conge
export const createLeaveType = async (data) => {
  const response = await http.post(LEAVE_TYPES_ENDPOINT, data);
  return response.data;
};

// Modifier un type de conge
export const updateLeaveType = async (id, data) => {
  const response = await http.put(`${LEAVE_TYPES_ENDPOINT}/${id}`, data);
  return response.data;
};

// Activer/Desactiver un type de conge
export const toggleLeaveTypeStatus = async (id) => {
  const response = await http.patch(`${LEAVE_TYPES_ENDPOINT}/${id}/toggle-status`);
  return response.data;
};

// Supprimer un type de conge
export const deleteLeaveType = async (id) => {
  const response = await http.delete(`${LEAVE_TYPES_ENDPOINT}/${id}`);
  return response.data;
};

// Initialiser les types de conges par defaut
export const initDefaultLeaveTypes = async () => {
  const response = await http.post(`${LEAVE_TYPES_ENDPOINT}/init-defaults`);
  return response.data;
};

// ============================================
// DEMANDES DE CONGES
// ============================================

const LEAVES_ENDPOINT = '/leaves';

// Recuperer toutes les demandes de conges
export const getLeaves = async (params = {}) => {
  const {
    page = 1, limit = 20, search, statut, leaveTypeId,
    employeeId, dateDebut, dateFin, annee
  } = params;
  const queryParams = new URLSearchParams();

  queryParams.append('page', page);
  queryParams.append('limit', limit);

  if (search) queryParams.append('search', search);
  if (statut) queryParams.append('statut', statut);
  if (leaveTypeId) queryParams.append('leaveTypeId', leaveTypeId);
  if (employeeId) queryParams.append('employeeId', employeeId);
  if (dateDebut) queryParams.append('dateDebut', dateDebut);
  if (dateFin) queryParams.append('dateFin', dateFin);
  if (annee) queryParams.append('annee', annee);

  const response = await http.get(`${LEAVES_ENDPOINT}?${queryParams.toString()}`);
  return response.data;
};

// Recuperer une demande par ID
export const getLeaveById = async (id) => {
  const response = await http.get(`${LEAVES_ENDPOINT}/${id}`);
  return response.data;
};

// Generer une reference unique
export const generateLeaveReference = async () => {
  const response = await http.get(`${LEAVES_ENDPOINT}/generate-reference`);
  return response.data;
};

// Creer une demande de conge
export const createLeave = async (data) => {
  const response = await http.post(LEAVES_ENDPOINT, data);
  return response.data;
};

// Modifier une demande de conge (brouillon)
export const updateLeave = async (id, data) => {
  const response = await http.put(`${LEAVES_ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer une demande (brouillon)
export const deleteLeave = async (id) => {
  const response = await http.delete(`${LEAVES_ENDPOINT}/${id}`);
  return response.data;
};

// Soumettre une demande
export const submitLeave = async (id) => {
  const response = await http.post(`${LEAVES_ENDPOINT}/${id}/submit`);
  return response.data;
};

// Approuver niveau 1 (Manager)
export const approveLeaveN1 = async (id, data = {}) => {
  const response = await http.post(`${LEAVES_ENDPOINT}/${id}/approve-n1`, data);
  return response.data;
};

// Approuver niveau 2 (RH) - Approbation finale
export const approveLeaveN2 = async (id, data = {}) => {
  const response = await http.post(`${LEAVES_ENDPOINT}/${id}/approve-n2`, data);
  return response.data;
};

// Refuser une demande
export const rejectLeave = async (id, data) => {
  const response = await http.post(`${LEAVES_ENDPOINT}/${id}/reject`, data);
  return response.data;
};

// Annuler une demande
export const cancelLeave = async (id, data = {}) => {
  const response = await http.post(`${LEAVES_ENDPOINT}/${id}/cancel`, data);
  return response.data;
};

// Obtenir le solde de conges d'un employe
export const getEmployeeBalance = async (employeeId, annee) => {
  const queryParams = annee ? `?annee=${annee}` : '';
  const response = await http.get(`${LEAVES_ENDPOINT}/employee/${employeeId}/balance${queryParams}`);
  return response.data;
};

// Obtenir les statistiques des conges
export const getLeaveStats = async (annee) => {
  const queryParams = annee ? `?annee=${annee}` : '';
  const response = await http.get(`${LEAVES_ENDPOINT}/stats${queryParams}`);
  return response.data;
};

// Obtenir le calendrier des conges
export const getLeaveCalendar = async (debut, fin, departement) => {
  const queryParams = new URLSearchParams();
  queryParams.append('debut', debut);
  queryParams.append('fin', fin);
  if (departement) queryParams.append('departement', departement);

  const response = await http.get(`${LEAVES_ENDPOINT}/calendar?${queryParams.toString()}`);
  return response.data;
};

// ============================================
// HELPERS
// ============================================

// Labels des statuts
export const LEAVE_STATUS_LABELS = {
  brouillon: 'Brouillon',
  en_attente: 'En attente',
  approuve_n1: 'Approuve Manager',
  approuve: 'Approuve',
  refuse: 'Refuse',
  annule: 'Annule'
};

// Couleurs des statuts
export const LEAVE_STATUS_COLORS = {
  brouillon: 'default',
  en_attente: 'warning',
  approuve_n1: 'info',
  approuve: 'success',
  refuse: 'error',
  annule: 'default'
};

// Obtenir le label d'un statut
export const getStatusLabel = (statut) => {
  return LEAVE_STATUS_LABELS[statut] || statut;
};

// Obtenir la couleur d'un statut
export const getStatusColor = (statut) => {
  return LEAVE_STATUS_COLORS[statut] || 'default';
};

// Calculer le nombre de jours ouvrables entre deux dates
export const calculateWorkingDays = (startDate, endDate) => {
  let count = 0;
  const start = new Date(startDate);
  const end = new Date(endDate);

  while (start <= end) {
    const dayOfWeek = start.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    start.setDate(start.getDate() + 1);
  }

  return count;
};

export default {
  // Types de conges
  getLeaveTypes,
  getLeaveTypeById,
  generateLeaveTypeCode,
  createLeaveType,
  updateLeaveType,
  toggleLeaveTypeStatus,
  deleteLeaveType,
  initDefaultLeaveTypes,
  // Demandes de conges
  getLeaves,
  getLeaveById,
  generateLeaveReference,
  createLeave,
  updateLeave,
  deleteLeave,
  submitLeave,
  approveLeaveN1,
  approveLeaveN2,
  rejectLeave,
  cancelLeave,
  getEmployeeBalance,
  getLeaveStats,
  getLeaveCalendar,
  // Helpers
  getStatusLabel,
  getStatusColor,
  calculateWorkingDays,
  LEAVE_STATUS_LABELS,
  LEAVE_STATUS_COLORS
};
