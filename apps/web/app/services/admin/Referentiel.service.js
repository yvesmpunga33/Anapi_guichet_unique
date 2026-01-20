import http from '../../http-common';

// ============ PROVINCES ============
export const ReferentielProvinceList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/referentiels/provinces${queryString ? `?${queryString}` : ''}`);
};

export const ReferentielProvinceGetById = (id) => {
  return http.get(`/referentiels/provinces/${id}`);
};

export const ReferentielProvinceCreate = (data) => {
  return http.post('/referentiels/provinces', data);
};

export const ReferentielProvinceUpdate = (id, data) => {
  return http.put(`/referentiels/provinces/${id}`, data);
};

export const ReferentielProvinceDelete = (id) => {
  return http.delete(`/referentiels/provinces/${id}`);
};

// ============ VILLES / CITIES ============
export const VilleList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/referentiels/cities${queryString ? `?${queryString}` : ''}`);
};

// Alias using /cities endpoint
export const ReferentielCityList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/referentiels/cities${queryString ? `?${queryString}` : ''}`);
};

export const VilleGetById = (id) => {
  return http.get(`/referentiels/cities/${id}`);
};

export const VilleCreate = (data) => {
  return http.post('/referentiels/cities', data);
};

export const VilleUpdate = (id, data) => {
  return http.put(`/referentiels/cities/${id}`, data);
};

export const VilleDelete = (id) => {
  return http.delete(`/referentiels/cities/${id}`);
};

export const VilleListByProvince = (provinceId) => {
  return http.get(`/referentiels/cities?provinceId=${provinceId}`);
};

// ============ COMMUNES ============
export const CommuneList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/referentiels/communes${queryString ? `?${queryString}` : ''}`);
};

export const CommuneGetById = (id) => {
  return http.get(`/referentiels/communes/${id}`);
};

export const CommuneCreate = (data) => {
  return http.post('/referentiels/communes', data);
};

export const CommuneUpdate = (id, data) => {
  return http.put(`/referentiels/communes/${id}`, data);
};

export const CommuneDelete = (id) => {
  return http.delete(`/referentiels/communes/${id}`);
};

export const CommuneListByVille = (villeId) => {
  return http.get(`/referentiels/communes?villeId=${villeId}`);
};

// ============ MINISTRIES ============
export const ReferentielMinistryList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/referentiels/ministries${queryString ? `?${queryString}` : ''}`);
};

export const ReferentielMinistryGetById = (id) => {
  return http.get(`/referentiels/ministries/${id}`);
};

export const ReferentielMinistryCreate = (data) => {
  return http.post('/referentiels/ministries', data);
};

export const ReferentielMinistryUpdate = (id, data) => {
  return http.put(`/referentiels/ministries/${id}`, data);
};

export const ReferentielMinistryDelete = (id) => {
  return http.delete(`/referentiels/ministries/${id}`);
};

// ============ SECTORS ============
export const ReferentielSectorList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/referentiels/sectors${queryString ? `?${queryString}` : ''}`);
};

export const ReferentielSectorGetById = (id) => {
  return http.get(`/referentiels/sectors/${id}`);
};

export const ReferentielSectorCreate = (data) => {
  return http.post('/referentiels/sectors', data);
};

export const ReferentielSectorUpdate = (id, data) => {
  return http.put(`/referentiels/sectors/${id}`, data);
};

export const ReferentielSectorDelete = (id) => {
  return http.delete(`/referentiels/sectors/${id}`);
};

// ============ CURRENCIES ============
export const CurrencyList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/referentiels/currencies${queryString ? `?${queryString}` : ''}`);
};

export const CurrencyGetById = (id) => {
  return http.get(`/referentiels/currencies/${id}`);
};

export const CurrencyCreate = (data) => {
  return http.post('/referentiels/currencies', data);
};

export const CurrencyUpdate = (id, data) => {
  return http.put(`/referentiels/currencies/${id}`, data);
};

export const CurrencyDelete = (id) => {
  return http.delete(`/referentiels/currencies/${id}`);
};

// ============ COUNTRIES ============
export const CountryList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/referentiels/countries${queryString ? `?${queryString}` : ''}`);
};

export const CountryGetById = (id) => {
  return http.get(`/referentiels/countries/${id}`);
};

export const CountryCreate = (data) => {
  return http.post('/referentiels/countries', data);
};

export const CountryUpdate = (id, data) => {
  return http.put(`/referentiels/countries/${id}`, data);
};

export const CountryDelete = (id) => {
  return http.delete(`/referentiels/countries/${id}`);
};
