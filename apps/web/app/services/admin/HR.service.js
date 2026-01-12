import http from '../../http-common';

// ============ EMPLOYEES ============
export const EmployeeList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/hr/employees${queryString ? `?${queryString}` : ''}`);
};

export const EmployeeGetById = (id) => {
  return http.get(`/hr/employees/${id}`);
};

export const EmployeeCreate = (data) => {
  return http.post('/hr/employees', data);
};

export const EmployeeCreateWithFormData = (formData) => {
  return http.post('/hr/employees', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const EmployeeUpdate = (id, data) => {
  return http.put(`/hr/employees/${id}`, data);
};

export const EmployeeUpdateWithFormData = (id, formData) => {
  return http.put(`/hr/employees/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const EmployeeDelete = (id) => {
  return http.delete(`/hr/employees/${id}`);
};

export const EmployeeToggleStatus = (id, isActive) => {
  return http.put(`/hr/employees/${id}/status`, { isActive });
};

// ============ DEPARTMENTS ============
export const HRDepartmentList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/hr/departments${queryString ? `?${queryString}` : ''}`);
};

export const HRDepartmentGetById = (id) => {
  return http.get(`/hr/departments/${id}`);
};

export const HRDepartmentCreate = (data) => {
  return http.post('/hr/departments', data);
};

export const HRDepartmentUpdate = (id, data) => {
  return http.put(`/hr/departments/${id}`, data);
};

export const HRDepartmentDelete = (id) => {
  return http.delete(`/hr/departments/${id}`);
};

// ============ WORKER CATEGORIES ============
export const WorkerCategoryList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/hr/worker-categories${queryString ? `?${queryString}` : ''}`);
};

export const WorkerCategoryGetById = (id) => {
  return http.get(`/hr/worker-categories/${id}`);
};

export const WorkerCategoryCreate = (data) => {
  return http.post('/hr/worker-categories', data);
};

export const WorkerCategoryUpdate = (id, data) => {
  return http.put(`/hr/worker-categories/${id}`, data);
};

export const WorkerCategoryDelete = (id) => {
  return http.delete(`/hr/worker-categories/${id}`);
};

// ============ GRADES ============
export const GradeList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/hr/grades${queryString ? `?${queryString}` : ''}`);
};

export const GradeGetById = (id) => {
  return http.get(`/hr/grades/${id}`);
};

export const GradeCreate = (data) => {
  return http.post('/hr/grades', data);
};

export const GradeUpdate = (id, data) => {
  return http.put(`/hr/grades/${id}`, data);
};

export const GradeDelete = (id) => {
  return http.delete(`/hr/grades/${id}`);
};

// ============ POSITIONS ============
export const PositionList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/hr/positions${queryString ? `?${queryString}` : ''}`);
};

export const PositionGetById = (id) => {
  return http.get(`/hr/positions/${id}`);
};

export const PositionCreate = (data) => {
  return http.post('/hr/positions', data);
};

export const PositionUpdate = (id, data) => {
  return http.put(`/hr/positions/${id}`, data);
};

export const PositionDelete = (id) => {
  return http.delete(`/hr/positions/${id}`);
};
