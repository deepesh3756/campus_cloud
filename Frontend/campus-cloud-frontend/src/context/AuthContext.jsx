import { createContext, useState, useEffect } from 'react';
import authService from '../services/api/authService';
import { tokenService } from '../services/storage/tokenService';
import userService from '../services/api/userService';

const AuthContext = createContext(null);

const normalizeUser = (u) => {
  if (!u) return u;
  return {
    ...u,
    role: typeof u.role === 'string' ? u.role.toLowerCase() : u.role,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenService.getToken();
      if (token) {
        try {
          const me = await userService.getMe();
          if (me) {
            const normalizedUser = normalizeUser(me);
            setUser(normalizedUser);
            localStorage.setItem('auth_user', JSON.stringify(normalizedUser));
          }
        } catch {
          tokenService.removeToken();
          localStorage.removeItem('auth_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);

    // authService.login already returns the unwrapped data: { accessToken, user, ... }
    const { accessToken, user } = response || {};
    
    if (!accessToken) {
      throw new Error('Login failed: No access token received');
    }
    
    tokenService.setToken(accessToken);

    try {
      const me = await userService.getMe();
      const normalizedUser = normalizeUser(me || user);

      setUser(normalizedUser);
      localStorage.setItem('auth_user', JSON.stringify(normalizedUser));
    } catch {
      const normalizedUser = normalizeUser(user);
      setUser(normalizedUser);
      localStorage.setItem('auth_user', JSON.stringify(normalizedUser));
    }

    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenService.removeToken();
      localStorage.removeItem('auth_user');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
