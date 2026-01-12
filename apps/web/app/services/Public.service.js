import http from '../http-common';

// ============ PUBLIC OPPORTUNITIES ============
export const PublicOpportunityGetById = (id) => {
  return http.get(`/public/opportunities/${id}`);
};

// ============ PUBLIC PROVINCES ============
export const PublicProvinceOpportunities = (provinceId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/public/provinces/${provinceId}/opportunities${queryString ? `?${queryString}` : ''}`);
};

// ============ PUBLIC PROVINCES LIST ============
export const PublicProvinceList = () => {
  return http.get('/public/provinces');
};

// ============ PUBLIC SECTORS ============
export const PublicSectorList = () => {
  return http.get('/public/sectors');
};
