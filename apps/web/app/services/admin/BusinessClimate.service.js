import http from '../../http-common';

// ============ BARRIERS ============
export const BarrierList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/business-climate/barriers${queryString ? `?${queryString}` : ''}`);
};

export const BarrierGetById = (id) => {
  return http.get(`/business-climate/barriers/${id}`);
};

export const BarrierCreate = (data) => {
  return http.post('/business-climate/barriers', data);
};

export const BarrierUpdate = (id, data) => {
  return http.put(`/business-climate/barriers/${id}`, data);
};

export const BarrierDelete = (id) => {
  return http.delete(`/business-climate/barriers/${id}`);
};

// ============ DIALOGUES ============
export const DialogueList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/business-climate/dialogues${queryString ? `?${queryString}` : ''}`);
};

export const DialogueGetById = (id) => {
  return http.get(`/business-climate/dialogues/${id}`);
};

export const DialogueCreate = (data) => {
  return http.post('/business-climate/dialogues', data);
};

export const DialogueUpdate = (id, data) => {
  return http.put(`/business-climate/dialogues/${id}`, data);
};

export const DialogueDelete = (id) => {
  return http.delete(`/business-climate/dialogues/${id}`);
};

// ============ INDICATORS ============
export const IndicatorList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/business-climate/indicators${queryString ? `?${queryString}` : ''}`);
};

export const IndicatorGetById = (id) => {
  return http.get(`/business-climate/indicators/${id}`);
};

export const IndicatorCreate = (data) => {
  return http.post('/business-climate/indicators', data);
};

export const IndicatorUpdate = (id, data) => {
  return http.put(`/business-climate/indicators/${id}`, data);
};

export const IndicatorDelete = (id) => {
  return http.delete(`/business-climate/indicators/${id}`);
};

// ============ MEDIATIONS ============
export const MediationList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/business-climate/mediations${queryString ? `?${queryString}` : ''}`);
};

export const MediationGetById = (id) => {
  return http.get(`/business-climate/mediations/${id}`);
};

export const MediationCreate = (data) => {
  return http.post('/business-climate/mediations', data);
};

export const MediationUpdate = (id, data) => {
  return http.put(`/business-climate/mediations/${id}`, data);
};

export const MediationDelete = (id) => {
  return http.delete(`/business-climate/mediations/${id}`);
};

// ============ PROPOSALS ============
export const ProposalList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/business-climate/proposals${queryString ? `?${queryString}` : ''}`);
};

export const ProposalGetById = (id) => {
  return http.get(`/business-climate/proposals/${id}`);
};

export const ProposalCreate = (data) => {
  return http.post('/business-climate/proposals', data);
};

export const ProposalUpdate = (id, data) => {
  return http.put(`/business-climate/proposals/${id}`, data);
};

export const ProposalDelete = (id) => {
  return http.delete(`/business-climate/proposals/${id}`);
};

// ============ TREATIES ============
export const TreatyList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/business-climate/treaties${queryString ? `?${queryString}` : ''}`);
};

export const TreatyGetById = (id) => {
  return http.get(`/business-climate/treaties/${id}`);
};

export const TreatyCreate = (data) => {
  return http.post('/business-climate/treaties', data);
};

export const TreatyUpdate = (id, data) => {
  return http.put(`/business-climate/treaties/${id}`, data);
};

export const TreatyDelete = (id) => {
  return http.delete(`/business-climate/treaties/${id}`);
};

// ============ STATISTICS ============
export const BusinessClimateStatistics = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/business-climate/statistics${queryString ? `?${queryString}` : ''}`);
};

// ============ BARRIER RESOLUTIONS ============
export const BarrierResolutionList = (barrierId) => {
  return http.get(`/business-climate/barriers/${barrierId}/resolutions`);
};

export const BarrierResolutionCreate = (barrierId, data) => {
  return http.post(`/business-climate/barriers/${barrierId}/resolutions`, data);
};

export const BarrierResolutionUpdate = (barrierId, resolutionId, data) => {
  return http.put(`/business-climate/barriers/${barrierId}/resolutions/${resolutionId}`, data);
};

// ============ INDICATOR VALUES ============
export const IndicatorValueList = (indicatorId) => {
  return http.get(`/business-climate/indicators/${indicatorId}/values`);
};

export const IndicatorValueCreate = (indicatorId, data) => {
  return http.post(`/business-climate/indicators/${indicatorId}/values`, data);
};
