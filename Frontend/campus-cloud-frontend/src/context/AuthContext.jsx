import { createContext, useState, useEffect } from 'react';
import authService from '../services/api/authService';
import { tokenService } from '../services/storage/tokenService';

const AuthContext = createContext(null);

// ========================================
// TEMP MOCK AUTH - FOR FRONTEND TESTING ONLY
// ========================================
// Change role to: "student" | "faculty" | "admin"
const MOCK_USER = {
  id: 1,
  name: "Mohit",
  email: "mohit@campuscloud.com",
  role: "student" // 👈 CHANGE THIS TO TEST DIFFERENT ROLES
};
const MOCK_TOKEN = "mock-token-temporary-for-testing";
// ========================================"

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenService.getToken();
      if (token) {
        // TEMP MOCK AUTH: Check for mock token
        if (token === MOCK_TOKEN) {
          setUser(MOCK_USER);
        } else {
          // ⬇️ ORIGINAL BACKEND CODE (commented out for testing)
          // try {
          //   const userData = await authService.getCurrentUser();
          //   setUser(userData);
          // } catch (error) {
          //   tokenService.removeToken();
          // }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async () => {
    // TEMP MOCK AUTH: Simulate login without backend
    tokenService.setToken(MOCK_TOKEN);
    setUser(MOCK_USER);
    return {
      token: MOCK_TOKEN,
      user: MOCK_USER
    };
    
    // ⬇️ ORIGINAL BACKEND CODE (commented out for testing)
    // const response = await authService.login(credentials);
    // tokenService.setToken(response.token);
    // setUser(response.user);
    // return response;
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
