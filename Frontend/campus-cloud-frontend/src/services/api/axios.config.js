import axios from 'axios';
import { getToken } from '../storage/tokenService';
import tokenService from '../storage/tokenService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getCookieValue = (name) => {
  const parts = document.cookie.split('; ');
  for (const part of parts) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    const key = part.slice(0, index);
    if (key === name) {
      return decodeURIComponent(part.slice(index + 1));
    }
  }
  return null;
};

const isAuthEndpoint = (url = '') => {
  return (
    url.includes('/api/users/login') ||
    url.includes('/api/users/refresh-token') ||
    url.includes('/api/users/logout')
  );
};

let refreshPromise = null;

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const requestUrl = config.url || '';

    const token = getToken();
    if (token && !isAuthEndpoint(requestUrl)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }

    const csrfToken = getCookieValue('XSRF-TOKEN');
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';
    const isAuthRequest = isAuthEndpoint(requestUrl);
    const isRefreshRequest = requestUrl.includes('/api/users/refresh-token');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            const csrfToken = getCookieValue('XSRF-TOKEN');
            const refreshResponse = await axios.post(
              `${api.defaults.baseURL}/api/users/refresh-token`,
              {},
              {
                withCredentials: true,
                headers: csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {},
              }
            );
            return refreshResponse;
          })();
        }

        const refreshResponse = await refreshPromise;

        const refreshPayload = refreshResponse.data?.data ?? refreshResponse.data;
        const accessToken = refreshPayload?.accessToken;
        if (!accessToken) {
          throw new Error('Missing accessToken in refresh response');
        }

        tokenService.setToken(accessToken);
        if (refreshPayload?.user) {
          const refreshedUser = {
            ...refreshPayload.user,
            role:
              typeof refreshPayload.user.role === 'string'
                ? refreshPayload.user.role.toLowerCase()
                : refreshPayload.user.role,
          };
          localStorage.setItem('auth_user', JSON.stringify(refreshedUser));
        }

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        tokenService.removeToken();
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        refreshPromise = null;
      }
    }

    if (error.response?.status === 401 && isRefreshRequest) {
      tokenService.removeToken();
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
