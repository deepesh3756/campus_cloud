import api from './axios.config';

export const userService = {
  getMe: async () => {
    const response = await api.get('/api/users/me');
    return response.data?.data ?? response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/users/me');
    return response.data?.data ?? response.data;
  },

  getFaculties: async () => {
    const response = await api.get('/api/users/faculties');
    return response.data?.data ?? response.data;
  },

  getStudents: async () => {
    const response = await api.get('/api/users/students');
    return response.data?.data ?? response.data;
  },

  getUserProfile: async (userId) => {
    const response = await api.get(`/api/users/profile/${userId}`);
    return response.data?.data ?? response.data;
  },

  updateUserProfile: async (userId, payload) => {
    const response = await api.put(`/api/users/profile/${userId}`, payload);
    return response.data?.data ?? response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.patch(`/api/users/${userId}/status`, { status });
    return response.data?.data ?? response.data;
  },

  checkUsernameAvailable: async (username) => {
    const response = await api.get('/api/users/check-username', {
      params: { username },
    });
    return response.data?.data ?? response.data;
  },

  getUsersByIds: async (userIds) => {
    const response = await api.post('/api/users/by-ids', Array.isArray(userIds) ? userIds : []);
    return response.data?.data ?? response.data;
  },

  registerUsersInBulk: async (entries) => {
    const response = await api.post('/api/users/bulk-details', Array.isArray(entries) ? entries : []);
    return response.data?.data ?? response.data;
  },

  getFacultiesByIds: async (userIds) => {
    const response = await api.post('/api/users/faculties/by-ids', Array.isArray(userIds) ? userIds : []);
    return response.data?.data ?? response.data;
  },

  updateProfile: async (userData) => {
    const userId = userData?.userId;
    if (!userId) {
      throw new Error('Missing userId for profile update');
    }
    const response = await api.put(`/api/users/profile/${userId}`, userData);
    return response.data?.data ?? response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/api/users/change-password', passwordData);
    return response.data?.data ?? response.data;
  },
};

export default userService;
