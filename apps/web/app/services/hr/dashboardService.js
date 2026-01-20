'use client';

import http from '../../http-common';

const ENDPOINT = '/hr-payroll/dashboard';

// Recuperer les statistiques du dashboard
export const getDashboardStats = async () => {
  try {
    const response = await http.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.warn('Dashboard stats fetch failed:', error.message);
    return { success: false, data: null };
  }
};

// Recuperer les statistiques des employes pour le dashboard
export const getDashboardEmployeeStats = async () => {
  const response = await http.get('/hr-payroll/employees/statistics');
  return response.data;
};

// Recuperer les activites recentes
export const getRecentActivities = async (limit = 10) => {
  const response = await http.get(`${ENDPOINT}/activities?limit=${limit}`);
  return response.data;
};

// Recuperer les demandes de conges en attente
export const getPendingLeaves = async () => {
  const response = await http.get(`${ENDPOINT}/pending-leaves`);
  return response.data;
};

// Recuperer les presences du jour
export const getTodayAttendance = async () => {
  const response = await http.get(`${ENDPOINT}/today-attendance`);
  return response.data;
};

// Recuperer les anniversaires du mois
export const getUpcomingBirthdays = async () => {
  const response = await http.get(`${ENDPOINT}/birthdays`);
  return response.data;
};

export default {
  getDashboardStats,
  getDashboardEmployeeStats,
  getRecentActivities,
  getPendingLeaves,
  getTodayAttendance,
  getUpcomingBirthdays,
};
