import http from '../../http-common';

// ============ MESSAGES ============
export const MessageList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/messages${queryString ? `?${queryString}` : ''}`);
};

export const MessageListInbox = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/messages/inbox${queryString ? `?${queryString}` : ''}`);
};

export const MessageListSent = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/messages/sent${queryString ? `?${queryString}` : ''}`);
};

export const MessageListDrafts = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/messages/drafts${queryString ? `?${queryString}` : ''}`);
};

export const MessageListArchived = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/messages/archived${queryString ? `?${queryString}` : ''}`);
};

export const MessageGetById = (id) => {
  return http.get(`/messages/${id}`);
};

export const MessageCreate = (data) => {
  return http.post('/messages', data);
};

export const MessageCreateWithFormData = (formData) => {
  return http.post('/messages', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const MessageUpdate = (id, data) => {
  return http.put(`/messages/${id}`, data);
};

export const MessageDelete = (id) => {
  return http.delete(`/messages/${id}`);
};

export const MessageMarkAsRead = (id) => {
  return http.put(`/messages/${id}/read`);
};

export const MessageMarkAsUnread = (id) => {
  return http.put(`/messages/${id}/unread`);
};

export const MessageArchive = (id) => {
  return http.put(`/messages/${id}/archive`);
};

export const MessageUnarchive = (id) => {
  return http.put(`/messages/${id}/unarchive`);
};

export const MessageGetUnreadCount = () => {
  return http.get('/messages/unread/count');
};

export const MessageMarkAllAsRead = () => {
  return http.put('/messages/read-all');
};

// ============ CONVERSATIONS ============
export const ConversationList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/messages/conversations${queryString ? `?${queryString}` : ''}`);
};

export const ConversationGetById = (id) => {
  return http.get(`/messages/conversations/${id}`);
};

export const ConversationGetMessages = (conversationId) => {
  return http.get(`/messages/conversations/${conversationId}/messages`);
};

// ============ EXTERNAL EMAILS ============
export const ExternalEmailList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/messages/external${queryString ? `?${queryString}` : ''}`);
};

export const ExternalEmailInboxList = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return http.get(`/messages/external/inbox${queryString ? `?${queryString}` : ''}`);
};

export const ExternalEmailSync = () => {
  return http.post('/messages/external/inbox');
};

// ============ UNREAD COUNT ============
export const MessageUnreadCount = () => {
  return http.get('/messages/unread-count');
};
