import apiClient from './api';

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Sign up new user
   */
  signup: async (username, email, password) => {
    const response = await apiClient.post('/auth/signup', {
      username,
      email,
      password,
    });
    return response.data;
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (updateData) => {
    const response = await apiClient.put('/auth/profile', updateData);
    return response.data;
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

/**
 * Note Service
 */
export const noteService = {
  /**
   * Create note
   */
  createNote: async (title, content) => {
    const response = await apiClient.post('/notes', { title, content });
    return response.data;
  },

  /**
   * Get user notes
   */
  getNotes: async (filters = {}) => {
    const response = await apiClient.get('/notes', { params: filters });
    return response.data;
  },

  /**
   * Get note by ID
   */
  getNoteById: async (id) => {
    const response = await apiClient.get(`/notes/${id}`);
    return response.data;
  },

  /**
   * Update note
   */
  updateNote: async (id, title, content, changeReason) => {
    const response = await apiClient.put(`/notes/${id}`, {
      title,
      content,
      changeReason,
    });
    return response.data;
  },

  /**
   * Delete note
   */
  deleteNote: async (id) => {
    const response = await apiClient.delete(`/notes/${id}`);
    return response.data;
  },

  /**
   * Add tag to note
   */
  addTag: async (noteId, tagId) => {
    const response = await apiClient.post(`/notes/${noteId}/tags`, { tagId });
    return response.data;
  },

  /**
   * Remove tag from note
   */
  removeTag: async (noteId, tagId) => {
    const response = await apiClient.delete(`/notes/${noteId}/tags`, {
      data: { tagId },
    });
    return response.data;
  },

  /**
   * Get note versions
   */
  getNoteVersions: async (noteId) => {
    const response = await apiClient.get(`/notes/${noteId}/versions`);
    return response.data;
  },

  /**
   * Restore note version
   */
  restoreVersion: async (noteId, versionId) => {
    const response = await apiClient.post(`/notes/${noteId}/versions/restore`, {
      versionId,
    });
    return response.data;
  },

  /**
   * Add comment
   */
  addComment: async (noteId, content) => {
    const response = await apiClient.post(`/notes/${noteId}/comments`, { content });
    return response.data;
  },

  /**
   * Get comments
   */
  getComments: async (noteId) => {
    const response = await apiClient.get(`/notes/${noteId}/comments`);
    return response.data;
  },
};

/**
 * Tag Service
 */
export const tagService = {
  /**
   * Create tag
   */
  createTag: async (name, color, isGlobal) => {
    const response = await apiClient.post('/tags', { name, color, isGlobal });
    return response.data;
  },

  /**
   * Get user tags
   */
  getTags: async () => {
    const response = await apiClient.get('/tags');
    return response.data;
  },

  /**
   * Update tag
   */
  updateTag: async (id, name, color) => {
    const response = await apiClient.put(`/tags/${id}`, { name, color });
    return response.data;
  },

  /**
   * Delete tag
   */
  deleteTag: async (id) => {
    const response = await apiClient.delete(`/tags/${id}`);
    return response.data;
  },

  /**
   * Get most used tags
   */
  getMostUsedTags: async (limit) => {
    const response = await apiClient.get('/tags/most-used', { params: { limit } });
    return response.data;
  },
};

/**
 * Group Service
 */
export const groupService = {
  /**
   * Create group
   */
  createGroup: async (name, description) => {
    const response = await apiClient.post('/groups', { name, description });
    return response.data;
  },

  /**
   * Get user groups
   */
  getGroups: async () => {
    const response = await apiClient.get('/groups');
    return response.data;
  },

  /**
   * Get group by ID
   */
  getGroupById: async (id) => {
    const response = await apiClient.get(`/groups/${id}`);
    return response.data;
  },

  /**
   * Update group
   */
  updateGroup: async (id, name, description) => {
    const response = await apiClient.put(`/groups/${id}`, { name, description });
    return response.data;
  },

  /**
   * Delete group
   */
  deleteGroup: async (id) => {
    const response = await apiClient.delete(`/groups/${id}`);
    return response.data;
  },

  /**
   * Add member
   */
  addMember: async (groupId, memberEmail) => {
    const response = await apiClient.post(`/groups/${groupId}/members`, { memberEmail });
    return response.data;
  },

  /**
   * Remove member
   */
  removeMember: async (groupId, memberId) => {
    const response = await apiClient.delete(`/groups/${groupId}/members`, {
      data: { memberId },
    });
    return response.data;
  },
};

/**
 * Share Service
 */
export const shareService = {
  /**
   * Share note with user
   */
  shareWithUser: async (noteId, sharedWithId, permission) => {
    const response = await apiClient.post(`/shares/${noteId}/share-user`, {
      sharedWithId,
      permission,
    });
    return response.data;
  },

  /**
   * Share note with group
   */
  shareWithGroup: async (noteId, groupId, permission) => {
    const response = await apiClient.post(`/shares/${noteId}/share-group`, {
      groupId,
      permission,
    });
    return response.data;
  },

  /**
   * Unshare note
   */
  unshareNote: async (noteId, sharedWithId, groupId) => {
    const response = await apiClient.delete(`/shares/${noteId}/unshare`, {
      data: { sharedWithId, groupId },
    });
    return response.data;
  },

  /**
   * Get shared notes
   */
  getSharedNotes: async () => {
    const response = await apiClient.get('/shares/shared');
    return response.data;
  },

  /**
   * Update permission
   */
  updatePermission: async (noteId, sharedWithId, permission) => {
    const response = await apiClient.put(`/shares/${noteId}/permission`, {
      sharedWithId,
      permission,
    });
    return response.data;
  },

  /**
   * Get note shares
   */
  getNoteShares: async (noteId) => {
    const response = await apiClient.get(`/shares/${noteId}/shares`);
    return response.data;
  },
};

/**
 * Notification Service
 */
export const notificationService = {
  /**
   * Get notifications
   */
  getNotifications: async (limit) => {
    const response = await apiClient.get('/notifications', { params: { limit } });
    return response.data;
  },

  /**
   * Get unread count
   */
  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },

  /**
   * Mark as read
   */
  markAsRead: async (notificationId) => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all as read
   */
  markAllAsRead: async () => {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId) => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

/**
 * Admin Service
 */
export const adminService = {
  /**
   * Get users
   */
  getUsers: async (page, limit) => {
    const response = await apiClient.get('/admin/users', { params: { page, limit } });
    return response.data;
  },

  /**
   * Deactivate user
   */
  deactivateUser: async (userId) => {
    const response = await apiClient.put(`/admin/users/${userId}/deactivate`);
    return response.data;
  },

  /**
   * Activate user
   */
  activateUser: async (userId) => {
    const response = await apiClient.put(`/admin/users/${userId}/activate`);
    return response.data;
  },

  /**
   * Get analytics
   */
  getAnalytics: async () => {
    const response = await apiClient.get('/admin/analytics');
    return response.data;
  },

  /**
   * Get user activity
   */
  getUserActivity: async (userId) => {
    const response = await apiClient.get(`/admin/users/${userId}/activity`);
    return response.data;
  },
};
