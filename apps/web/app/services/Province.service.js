import http from '../http-common';

// ============ PROVINCE PORTAL AUTH ============
export const ProvinceLogin = (data) => {
  return http.post('/province-portal/auth/login', data);
};

export const ProvinceLogout = () => {
  return http.post('/province-portal/auth/logout');
};

export const ProvinceGetCurrentUser = () => {
  return http.get('/province-portal/auth/me');
};

export const ProvinceResetPassword = (data) => {
  return http.post('/province-portal/auth/reset-password', data);
};

export const ProvinceChangePassword = (data) => {
  return http.post('/province-portal/auth/change-password', data);
};

// ============ PROVINCE SETTINGS ============
export const ProvinceSettingsGet = (provinceCode) => {
  return http.get(`/province-portal/${provinceCode}/settings`);
};

export const ProvinceSettingsUpdate = (provinceCode, data) => {
  return http.put(`/province-portal/${provinceCode}/settings`, data);
};

export const ProvinceSettingsGetPublic = (provinceCode) => {
  return http.get(`/province-portal/${provinceCode}/settings/public`);
};

// ============ PROVINCE DASHBOARD ============
export const ProvinceDashboardStats = (provinceCode) => {
  return http.get(`/province-portal/${provinceCode}/dashboard/stats`);
};

export const ProvinceDashboardKPIs = (provinceCode) => {
  return http.get(`/province-portal/${provinceCode}/dashboard/kpis`);
};

export const ProvinceDashboardRecent = (provinceCode) => {
  return http.get(`/province-portal/${provinceCode}/dashboard/recent`);
};

// ============ PROVINCE USERS ============
export const ProvinceUserList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/users${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceUserGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/users/${id}`);
};

export const ProvinceUserCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/users`, data);
};

export const ProvinceUserUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/users/${id}`, data);
};

export const ProvinceUserDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/users/${id}`);
};

export const ProvinceUserToggleStatus = (provinceCode, id, isActive) => {
  return http.patch(`/province-portal/${provinceCode}/users/${id}/status`, { isActive });
};

// ============ PROVINCE MESSAGES ============
export const ProvinceMessageList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/messages${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceMessageGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/messages/${id}`);
};

export const ProvinceMessageCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/messages`, data);
};

export const ProvinceMessageUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/messages/${id}`, data);
};

export const ProvinceMessageDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/messages/${id}`);
};

// ============ PROVINCE BANNERS ============
export const ProvinceBannerList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/banners${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceBannerGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/banners/${id}`);
};

export const ProvinceBannerCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/banners`, data);
};

export const ProvinceBannerUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/banners/${id}`, data);
};

export const ProvinceBannerDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/banners/${id}`);
};

// ============ PROVINCE NEWS ============
export const ProvinceNewsList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/news${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceNewsGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/news/${id}`);
};

export const ProvinceNewsCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/news`, data);
};

export const ProvinceNewsUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/news/${id}`, data);
};

export const ProvinceNewsDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/news/${id}`);
};

// ============ PROVINCE ACHIEVEMENTS ============
export const ProvinceAchievementList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/achievements${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceAchievementGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/achievements/${id}`);
};

export const ProvinceAchievementCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/achievements`, data);
};

export const ProvinceAchievementUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/achievements/${id}`, data);
};

export const ProvinceAchievementDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/achievements/${id}`);
};

// ============ PROVINCE EVENTS ============
export const ProvinceEventList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/events${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceEventGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/events/${id}`);
};

export const ProvinceEventCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/events`, data);
};

export const ProvinceEventUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/events/${id}`, data);
};

export const ProvinceEventDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/events/${id}`);
};

// ============ PROVINCE GALLERY ============
export const ProvinceGalleryList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/gallery${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceGalleryGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/gallery/${id}`);
};

export const ProvinceGalleryCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/gallery`, data);
};

export const ProvinceGalleryUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/gallery/${id}`, data);
};

export const ProvinceGalleryDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/gallery/${id}`);
};

// ============ PROVINCE INFRASTRUCTURE ============
export const ProvinceInfrastructureList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/infrastructure${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceInfrastructureGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/infrastructure/${id}`);
};

export const ProvinceInfrastructureCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/infrastructure`, data);
};

export const ProvinceInfrastructureUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/infrastructure/${id}`, data);
};

export const ProvinceInfrastructureDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/infrastructure/${id}`);
};

// ============ PROVINCE OPPORTUNITIES ============
export const ProvinceOpportunityList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/opportunities${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceOpportunityGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/opportunities/${id}`);
};

export const ProvinceOpportunityCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/opportunities`, data);
};

export const ProvinceOpportunityUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/opportunities/${id}`, data);
};

export const ProvinceOpportunityDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/opportunities/${id}`);
};

// ============ PROVINCE ORGANIZATION ============
export const ProvinceOrganizationList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/organization${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceOrganizationGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/organization/${id}`);
};

export const ProvinceOrganizationCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/organization`, data);
};

export const ProvinceOrganizationUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/organization/${id}`, data);
};

export const ProvinceOrganizationDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/organization/${id}`);
};

// ============ PROVINCE TOURISM ============
export const ProvinceTourismList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/tourism${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceTourismGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/tourism/${id}`);
};

export const ProvinceTourismCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/tourism`, data);
};

export const ProvinceTourismUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/tourism/${id}`, data);
};

export const ProvinceTourismDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/tourism/${id}`);
};

// ============ PROVINCE CULTURE ============
export const ProvinceCultureList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/culture${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceCultureGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/culture/${id}`);
};

export const ProvinceCultureCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/culture`, data);
};

export const ProvinceCultureUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/culture/${id}`, data);
};

export const ProvinceCultureDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/culture/${id}`);
};

// ============ PROVINCE EDUCATION ============
export const ProvinceEducationList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/education${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceEducationGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/education/${id}`);
};

export const ProvinceEducationCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/education`, data);
};

export const ProvinceEducationUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/education/${id}`, data);
};

export const ProvinceEducationDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/education/${id}`);
};

// ============ PROVINCE HEALTH ============
export const ProvinceHealthList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/health${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceHealthGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/health/${id}`);
};

export const ProvinceHealthCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/health`, data);
};

export const ProvinceHealthUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/health/${id}`, data);
};

export const ProvinceHealthDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/health/${id}`);
};

// ============ PROVINCE MASTER PLAN ============
export const ProvinceMasterPlanList = (provinceCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/province-portal/${provinceCode}/master-plan${queryString ? `?${queryString}` : ''}`);
};

export const ProvinceMasterPlanGetById = (provinceCode, id) => {
  return http.get(`/province-portal/${provinceCode}/master-plan/${id}`);
};

export const ProvinceMasterPlanCreate = (provinceCode, data) => {
  return http.post(`/province-portal/${provinceCode}/master-plan`, data);
};

export const ProvinceMasterPlanUpdate = (provinceCode, id, data) => {
  return http.put(`/province-portal/${provinceCode}/master-plan/${id}`, data);
};

export const ProvinceMasterPlanDelete = (provinceCode, id) => {
  return http.delete(`/province-portal/${provinceCode}/master-plan/${id}`);
};

// ============ PUBLIC PROVINCE DATA ============
export const PublicProvinceGetByCode = (provinceCode) => {
  return http.get(`/public/provinces/code/${provinceCode}`);
};

export const PublicProvinceListAll = () => {
  return http.get('/public/provinces');
};
