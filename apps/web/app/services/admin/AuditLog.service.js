import http from '../../http-common';

// GET - Liste tous les logs d'audit
export const AuditLogList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/audit-logs${queryString ? `?${queryString}` : ''}`);
};

// GET - Obtenir un log par ID
export const AuditLogGetById = (id) => {
  return http.get(`/audit-logs/${id}`);
};

// GET - Obtenir les logs d'une entité spécifique
export const AuditLogGetByEntity = (entityType, entityId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/audit-logs/entity/${entityType}/${entityId}${queryString ? `?${queryString}` : ''}`);
};

// GET - Résumé des activités (pour dashboard)
export const AuditLogGetSummary = (days = 7) => {
  return http.get(`/audit-logs/summary?days=${days}`);
};

// GET - Exporter les logs en CSV
export const AuditLogExport = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/audit-logs/export${queryString ? `?${queryString}` : ''}`, {
    responseType: 'blob'
  });
};
