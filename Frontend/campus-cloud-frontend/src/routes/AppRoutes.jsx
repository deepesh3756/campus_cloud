import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Auth Pages
import Login from '../pages/auth/Login';

// Student Pages
import StudentLayout from '../layouts/StudentLayout';
import StudentHomePage from '../pages/student/HomePage';
import StudentDashboardPage from '../pages/student/DashboardPage';
import StudentAssignmentsPage from '../pages/student/AssignmentsPage';
import AssignmentDetailPage from '../pages/student/AssignmentDetailPage';
import StudentProfilePage from '../pages/student/ProfilePage';

// Faculty Pages
import FacultyLayout from '../layouts/FacultyLayout';
import FacultyHomePage from '../pages/faculty/HomePage';
import SubjectsPage from '../pages/faculty/SubjectsPage';
import FacultyAssignmentsPage from '../pages/faculty/AssignmentsPage';
import AnalyticsPage from '../pages/faculty/AnalyticsPage';
import FacultyProfilePage from '../pages/faculty/ProfilePage';

// Admin Pages
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboardPage from '../pages/admin/DashboardPage';
import BatchesPage from '../pages/admin/BatchesPage';
import CoursesPage from '../pages/admin/CoursesPage';
import AdminSubjectsPage from '../pages/admin/SubjectsPage';
import StudentsPage from '../pages/admin/StudentsPage';
import FacultyPage from '../pages/admin/FacultyPage';
import LandingPage from '../pages/LandingPage';

import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Student Routes */}
      <Route
        path="/student"
        // element={
        //   <ProtectedRoute>
        //     <RoleBasedRoute allowedRoles={['student']}>
        //       <StudentLayout />
        //     </RoleBasedRoute>
        //   </ProtectedRoute>
        // }
        element={<StudentLayout />}
      >
        <Route index element={<StudentHomePage />} />
        <Route path="subjects/:subjectKey" element={<StudentAssignmentsPage />} />
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="assignments" element={<StudentAssignmentsPage />} />
        <Route path="assignments/:id" element={<AssignmentDetailPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>

      {/* Faculty Routes */}
      <Route
        path="/faculty"
        // element={
        //   <ProtectedRoute>
        //     <RoleBasedRoute allowedRoles={['faculty']}>
        //       <FacultyLayout />
        //     </RoleBasedRoute>
        //   </ProtectedRoute>
        // }
        element={<FacultyLayout />}
      >
        <Route index element={<FacultyHomePage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="assignments" element={<FacultyAssignmentsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile" element={<FacultyProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        // element={
        //   <ProtectedRoute>
        //     <RoleBasedRoute allowedRoles={['admin']}>
        //       <AdminLayout />
        //     </RoleBasedRoute>
        //   </ProtectedRoute>
        // }
        element={<AdminLayout />}
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="batches" element={<BatchesPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="subjects" element={<AdminSubjectsPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="faculty" element={<FacultyPage />} />
      </Route>

      {/* Default Landing */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to={
                user.role === 'admin'
                  ? '/admin'
                  : user.role === 'faculty'
                    ? '/faculty'
                    : '/student'
              }
              replace
            />
          ) : (
            <LandingPage />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
