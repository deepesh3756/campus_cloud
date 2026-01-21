import api from './axios.config';

export const authService = {
  login: async (credentials) => {
    // MOCK: Allow login for username 's' and password 's'
    if (credentials.username === 's' && credentials.password === 's') {
      return {
        token: 'mock-student-token',
        user: {
          id: 1,
          username: 's',
          role: 'student',
          name: 'Mock Student',
        },
      };
    }
    // Fallback to real API
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
