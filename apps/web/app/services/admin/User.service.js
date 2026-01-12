import http from '../../http-common';

// GET - Liste tous les utilisateurs
export const UserList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/users${queryString ? `?${queryString}` : ''}`);
};

// GET - Recherche avec filtres
export const UserSearch = (search, role, status) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (role) params.append('role', role);
  if (status) params.append('status', status);
  return http.get(`/users?${params.toString()}`);
};

// GET - Obtenir un utilisateur par ID
export const UserGetById = (id) => {
  return http.get(`/users/${id}`);
};

// POST - Créer un utilisateur
export const UserCreate = (data) => {
  return http.post('/users', data);
};

// POST - Créer avec FormData (photo)
export const UserCreateWithFormData = (formData) => {
  return http.post('/users', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// PUT - Mettre à jour un utilisateur
export const UserUpdate = (id, data) => {
  return http.put(`/users/${id}`, data);
};

// PUT - Mettre à jour avec FormData (photo)
export const UserUpdateWithFormData = (id, formData) => {
  return http.put(`/users/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// DELETE - Supprimer un utilisateur
export const UserDelete = (id) => {
  return http.delete(`/users/${id}`);
};

// PUT - Activer/Désactiver un utilisateur
export const UserToggleStatus = (id, isActive) => {
  return http.put(`/users/${id}/status`, { isActive });
};

// PUT - Changer le mot de passe
export const UserChangePassword = (id, currentPassword, newPassword) => {
  return http.put(`/users/${id}/password`, { currentPassword, newPassword });
};

// GET - Profil de l'utilisateur connecté
export const UserGetProfile = () => {
  return http.get('/users/profile');
};

// PUT - Mettre à jour son propre profil
export const UserUpdateProfile = (data) => {
  return http.put('/users/profile', data);
};

// GET - Liste par rôle
export const UserListByRole = (role) => {
  return http.get(`/users?role=${role}`);
};

// GET - Liste par ministère
export const UserListByMinistry = (ministryId) => {
  return http.get(`/users?ministryId=${ministryId}`);
};
