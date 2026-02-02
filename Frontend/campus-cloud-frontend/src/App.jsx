import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FacultyProvider } from './context/FacultyContext';
import AppRoutes from './routes/AppRoutes';
import './assets/styles/global.css';
import './App.css';

function App() {
  useEffect(() => {
    try {
      const flag = localStorage.getItem('auth_forced_logout');
      if (flag) {
        localStorage.removeItem('auth_forced_logout');
        toast.info('You have been logged out');
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <FacultyProvider>
            <AppRoutes />
          </FacultyProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
