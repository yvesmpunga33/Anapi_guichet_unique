import http from '../../http-common';

// ============ NOTIFICATIONS ============
export const NotificationList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/notifications${queryString ? `?${queryString}` : ''}`);
};

export const NotificationGetById = (id) => {
  return http.get(`/notifications/${id}`);
};

export const NotificationCreate = (data) => {
  return http.post('/notifications', data);
};

export const NotificationUpdate = (id, data) => {
  return http.put(`/notifications/${id}`, data);
};

export const NotificationDelete = (id) => {
  return http.delete(`/notifications/${id}`);
};

export const NotificationMarkAsRead = (id) => {
  return http.put(`/notifications/${id}/read`);
};

export const NotificationMarkAllAsRead = () => {
  return http.put('/notifications/read-all');
};

export const NotificationGetUnreadCount = () => {
  return http.get('/notifications/unread/count');
};

export const NotificationGetRecent = (limit = 10) => {
  return http.get(`/notifications/recent?limit=${limit}`);
};

export const NotificationDismiss = (id) => {
  return http.put(`/notifications/${id}/dismiss`);
};

export const NotificationDismissAll = () => {
  return http.put('/notifications/dismiss-all');
};

// ============ NOTIFICATION SETTINGS ============
export const NotificationSettingsGet = () => {
  return http.get('/notifications/settings');
};

export const NotificationSettingsUpdate = (data) => {
  return http.put('/notifications/settings', data);
};

// ============ NOTIFICATION ALERTS ============
export const NotificationAlertList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/notifications/alerts${queryString ? `?${queryString}` : ''}`);
};
