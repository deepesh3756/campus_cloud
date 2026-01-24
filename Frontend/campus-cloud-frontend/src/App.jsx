import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FacultyProvider } from './context/FacultyContext';
import AppRoutes from './routes/AppRoutes';
import './assets/styles/global.css';
import './App.css';

function App() {
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
