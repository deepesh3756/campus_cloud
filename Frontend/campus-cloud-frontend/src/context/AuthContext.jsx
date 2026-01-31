import { createContext, useState, useEffect } from 'react';
import authService from '../services/api/authService';
import { tokenService } from '../services/storage/tokenService';

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
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
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
    console.log('🔐 Login attempt with credentials:', credentials);
    const data = await authService.login(credentials);
    console.log('📦 Full response from authService.login:', data);

    // Backend returns: { success, message, data: { accessToken, user, ... } }
    const { accessToken, user } = data || {};
    console.log('🔑 Extracted accessToken:', accessToken);
    console.log('👤 Extracted user:', user);
    
    tokenService.setToken(accessToken);
    const normalizedUser = normalizeUser(user);
    console.log('✅ Normalized user:', normalizedUser);
    
    setUser(normalizedUser);
    localStorage.setItem('auth_user', JSON.stringify(normalizedUser));
    console.log('💾 User saved to localStorage and state');

    return data;
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
