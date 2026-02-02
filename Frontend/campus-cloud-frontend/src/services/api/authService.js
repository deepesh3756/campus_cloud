import api from './axios.config';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/users/login', credentials);
    return response.data?.data ?? response.data;
  },

  registerStudent: async (payload) => {
    const response = await api.post('/api/users/register/student', payload);
    return response.data?.data ?? response.data;
  },

  registerFaculty: async (payload) => {
    const response = await api.post('/api/users/register/faculty', payload);
    return response.data?.data ?? response.data;
  },

  register: async (userData) => {
    const role = (userData?.role || '').toLowerCase();
    const endpoint =
      role === 'admin'
        ? '/api/users/register/admin'
        : role === 'faculty'
          ? '/api/users/register/faculty'
          : '/api/users/register/student';

    const response = await api.post(endpoint, userData);
    return response.data?.data ?? response.data;
  },

  logout: async () => {
    const response = await api.post('/api/users/logout', {});
    return response.data?.data ?? response.data;
  },

  getCurrentUser: async () => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  },
};

export default authService;
