import http from '../http-common';

// ============ OPPORTUNITIES BY PROVINCE ============
export const OpportunitiesByProvince = () => {
  return http.get('/opportunities/by-province');
};

// ============ OPPORTUNITIES LIST ============
export const OpportunityList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/opportunities${queryString ? `?${queryString}` : ''}`);
};

export const OpportunityGetById = (id) => {
  return http.get(`/opportunities/${id}`);
};

// ============ INVESTOR DASHBOARD ============
export const InvestorDashboardStats = () => {
  return http.get('/investor/dashboard');
};

// ============ INVESTOR PROJECTS ============
export const InvestorProjectList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/investor/projects${queryString ? `?${queryString}` : ''}`);
};

export const InvestorProjectCreate = (data) => {
  return http.post('/investor/projects', data);
};

export const InvestorProjectGetById = (id) => {
  return http.get(`/investor/projects/${id}`);
};

// ============ INVESTOR APPROVALS ============
export const InvestorApprovalList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/investor/approvals${queryString ? `?${queryString}` : ''}`);
};

export const InvestorApprovalCreate = (data) => {
  return http.post('/investor/approvals', data);
};
