'use client';

import http from '../../http-common';

const ATTENDANCE_ENDPOINT = '/attendances';
const JUSTIFICATION_ENDPOINT = '/justifications';

// ==========================================
// CONSTANTES
// ==========================================

export const ATTENDANCE_STATUS = {
  present: { value: 'present', label: 'Present', color: '#4caf50', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  absent: { value: 'absent', label: 'Absent', color: '#f44336', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  late: { value: 'late', label: 'En retard', color: '#ff9800', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
  half_day: { value: 'half_day', label: 'Demi-journee', color: '#2196f3', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  leave: { value: 'leave', label: 'En conge', color: '#9c27b0', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
  holiday: { value: 'holiday', label: 'Jour ferie', color: '#607d8b', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
  weekend: { value: 'weekend', label: 'Week-end', color: '#9e9e9e', bgColor: 'bg-gray-100', textColor: 'text-gray-500' }
};

export const JUSTIFICATION_TYPES = {
  maladie: { value: 'maladie', label: 'Maladie', color: '#f44336', icon: 'healing', requiresDocument: true },
  accident: { value: 'accident', label: 'Accident de travail', color: '#e91e63', icon: 'emergency', requiresDocument: true },
  famille: { value: 'famille', label: 'Evenement familial', color: '#9c27b0', icon: 'family_restroom', requiresDocument: true },
  convocation: { value: 'convocation', label: 'Convocation officielle', color: '#673ab7', icon: 'gavel', requiresDocument: true },
  formation: { value: 'formation', label: 'Formation', color: '#3f51b5', icon: 'school', requiresDocument: false },
  mission: { value: 'mission', label: 'Mission de travail', color: '#2196f3', icon: 'flight', requiresDocument: false },
  greve: { value: 'greve', label: 'Greve', color: '#ff9800', icon: 'front_hand', requiresDocument: false },
  intemperie: { value: 'intemperie', label: 'Intemperies', color: '#795548', icon: 'thunderstorm', requiresDocument: false },
  transport: { value: 'transport', label: 'Probleme de transport', color: '#607d8b', icon: 'directions_bus', requiresDocument: false },
  autre: { value: 'autre', label: 'Autre motif', color: '#9e9e9e', icon: 'help', requiresDocument: false }
};

export const JUSTIFICATION_STATUS = {
  pending: { value: 'pending', label: 'En attente', color: '#ff9800', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
  approved: { value: 'approved', label: 'Approuvee', color: '#4caf50', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  rejected: { value: 'rejected', label: 'Rejetee', color: '#f44336', bgColor: 'bg-red-100', textColor: 'text-red-700' }
};

export const CHECK_IN_METHODS = {
  manual: { value: 'manual', label: 'Manuel', icon: 'edit', description: 'Pointage par le responsable RH' },
  fingerprint: { value: 'fingerprint', label: 'Empreinte digitale', icon: 'fingerprint', description: 'Reconnaissance biometrique' },
  facial: { value: 'facial', label: 'Reconnaissance faciale', icon: 'face', description: 'Camera de reconnaissance' },
  iris: { value: 'iris', label: 'Scan iris', icon: 'visibility', description: 'Scanner oculaire' },
  badge: { value: 'badge', label: 'Badge RFID', icon: 'credit_card', description: 'Badge electronique' },
  qrcode: { value: 'qrcode', label: 'QR Code', icon: 'qr_code', description: 'Scan de code QR' }
};

// ==========================================
// POINTAGE / ATTENDANCE
// ==========================================

// Pointage d'entree
export const checkIn = async (data) => {
  const response = await http.post(`${ATTENDANCE_ENDPOINT}/check-in`, data);
  return response.data;
};

// Pointage de sortie
export const checkOut = async (data) => {
  const response = await http.post(`${ATTENDANCE_ENDPOINT}/check-out`, data);
  return response.data;
};

// Marquer absent
export const markAbsent = async (data) => {
  const response = await http.post(`${ATTENDANCE_ENDPOINT}/mark-absent`, data);
  return response.data;
};

// Pointage en masse
export const bulkCheckIn = async (data) => {
  const response = await http.post(`${ATTENDANCE_ENDPOINT}/bulk-check-in`, data);
  return response.data;
};

// Obtenir les pointages du jour
export const getDailyAttendance = async (params = {}) => {
  const { date, departmentId, status, search, page, limit } = params;
  const queryParams = new URLSearchParams();
  if (date) queryParams.append('date', date);
  if (departmentId) queryParams.append('departmentId', departmentId);
  if (status) queryParams.append('status', status);
  if (search) queryParams.append('search', search);
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);

  const response = await http.get(`${ATTENDANCE_ENDPOINT}/daily?${queryParams.toString()}`);
  return response.data;
};

// Obtenir le rapport mensuel
export const getMonthlyReport = async (params = {}) => {
  const { month, year, employeeId, departmentId } = params;
  const queryParams = new URLSearchParams();
  if (month) queryParams.append('month', month);
  if (year) queryParams.append('year', year);
  if (employeeId) queryParams.append('employeeId', employeeId);
  if (departmentId) queryParams.append('departmentId', departmentId);

  const response = await http.get(`${ATTENDANCE_ENDPOINT}/monthly?${queryParams.toString()}`);
  return response.data;
};

// Obtenir les statistiques
export const getAttendanceStats = async (params = {}) => {
  const { startDate, endDate, departmentId } = params;
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  if (departmentId) queryParams.append('departmentId', departmentId);

  const response = await http.get(`${ATTENDANCE_ENDPOINT}/stats?${queryParams.toString()}`);
  return response.data;
};

// Obtenir l'historique d'un employe
export const getEmployeeHistory = async (employeeId, params = {}) => {
  const { startDate, endDate, page, limit } = params;
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);

  const response = await http.get(`${ATTENDANCE_ENDPOINT}/employee/${employeeId}?${queryParams.toString()}`);
  return response.data;
};

// Modifier un pointage
export const updateAttendance = async (id, data) => {
  const response = await http.put(`${ATTENDANCE_ENDPOINT}/${id}`, data);
  return response.data;
};

// Supprimer un pointage
export const deleteAttendance = async (id) => {
  const response = await http.delete(`${ATTENDANCE_ENDPOINT}/${id}`);
  return response.data;
};

// ==========================================
// JUSTIFICATIONS D'ABSENCE
// ==========================================

// Creer une justification
export const createJustification = async (data, file = null) => {
  const formData = new FormData();
  formData.append('employeeId', data.employeeId);
  formData.append('startDate', data.startDate);
  formData.append('endDate', data.endDate);
  formData.append('type', data.type);
  formData.append('reason', data.reason);
  if (data.isPaid !== undefined) formData.append('isPaid', data.isPaid);
  if (file) formData.append('document', file);

  const response = await http.post(JUSTIFICATION_ENDPOINT, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// Obtenir les justifications
export const getJustifications = async (params = {}) => {
  const { status, type, employeeId, departmentId, page, limit } = params;
  const queryParams = new URLSearchParams();
  if (status) queryParams.append('status', status);
  if (type) queryParams.append('type', type);
  if (employeeId) queryParams.append('employeeId', employeeId);
  if (departmentId) queryParams.append('departmentId', departmentId);
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);

  const response = await http.get(`${JUSTIFICATION_ENDPOINT}?${queryParams.toString()}`);
  return response.data;
};

// Obtenir une justification
export const getJustificationById = async (id) => {
  const response = await http.get(`${JUSTIFICATION_ENDPOINT}/${id}`);
  return response.data;
};

// Approuver une justification
export const approveJustification = async (id, data = {}) => {
  const response = await http.put(`${JUSTIFICATION_ENDPOINT}/${id}/approve`, data);
  return response.data;
};

// Rejeter une justification
export const rejectJustification = async (id, data = {}) => {
  const response = await http.put(`${JUSTIFICATION_ENDPOINT}/${id}/reject`, data);
  return response.data;
};

// Supprimer une justification
export const deleteJustification = async (id) => {
  const response = await http.delete(`${JUSTIFICATION_ENDPOINT}/${id}`);
  return response.data;
};

// Obtenir les types de justification
export const getJustificationTypes = async () => {
  const response = await http.get(`${JUSTIFICATION_ENDPOINT}/types`);
  return response.data;
};

// Obtenir les stats des justifications
export const getJustificationStats = async (params = {}) => {
  const { startDate, endDate } = params;
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const response = await http.get(`${JUSTIFICATION_ENDPOINT}/stats?${queryParams.toString()}`);
  return response.data;
};

// ==========================================
// HELPERS
// ==========================================

// Formater l'heure
export const formatTime = (time) => {
  if (!time) return '-';
  return time.substring(0, 5);
};

// Formater la duree en heures:minutes
export const formatDuration = (minutes) => {
  if (!minutes) return '0h00';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins.toString().padStart(2, '0')}`;
};

// Formater les heures travaillees
export const formatWorkingHours = (hours) => {
  if (!hours) return '0h00';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h${m.toString().padStart(2, '0')}`;
};

// Obtenir le statut d'un employe
export const getAttendanceStatusInfo = (status) => {
  return ATTENDANCE_STATUS[status] || ATTENDANCE_STATUS.absent;
};

// Obtenir les infos du type de justification
export const getJustificationTypeInfo = (type) => {
  return JUSTIFICATION_TYPES[type] || JUSTIFICATION_TYPES.autre;
};

// Obtenir les infos du statut de justification
export const getJustificationStatusInfo = (status) => {
  return JUSTIFICATION_STATUS[status] || JUSTIFICATION_STATUS.pending;
};

// Calculer le taux de presence
export const calculateAttendanceRate = (present, total) => {
  if (total === 0) return 0;
  return ((present / total) * 100).toFixed(1);
};

// Verifier si c'est un jour ouvrable
export const isWorkingDay = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  return day !== 0 && day !== 6; // Pas dimanche (0) ni samedi (6)
};

// Obtenir l'URL du document justificatif
export const getJustificationDocumentUrl = (documentPath) => {
  if (!documentPath) return null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4951/api/v1';
  const baseUrl = apiUrl.replace(/\/api\/v\d+|\/api/g, '');
  return `${baseUrl}${documentPath}`;
};

export default {
  // Pointage
  checkIn,
  checkOut,
  markAbsent,
  bulkCheckIn,
  getDailyAttendance,
  getMonthlyReport,
  getAttendanceStats,
  getEmployeeHistory,
  updateAttendance,
  deleteAttendance,

  // Justifications
  createJustification,
  getJustifications,
  getJustificationById,
  approveJustification,
  rejectJustification,
  deleteJustification,
  getJustificationTypes,
  getJustificationStats,

  // Constantes
  ATTENDANCE_STATUS,
  JUSTIFICATION_TYPES,
  JUSTIFICATION_STATUS,
  CHECK_IN_METHODS,

  // Helpers
  formatTime,
  formatDuration,
  formatWorkingHours,
  getAttendanceStatusInfo,
  getJustificationTypeInfo,
  getJustificationStatusInfo,
  calculateAttendanceRate,
  isWorkingDay,
  getJustificationDocumentUrl
};
