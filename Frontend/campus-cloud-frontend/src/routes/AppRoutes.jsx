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
import StudentSubjectsPage from "../pages/student/SubjectsPage";
import ProfilePage from "../pages/student/ProfilePage";



// Faculty Pages
import FacultyLayout from '../layouts/FacultyLayout';
import FacultyHomePage from '../pages/faculty/HomePage';
import FacultyDashboardPage from '../pages/faculty/DashboardPage';
import SubjectsPage from '../pages/faculty/SubjectsPage';
import FacultyAssignmentsPage from '../pages/faculty/AssignmentsPage';
import AddAssignmentPage from '../pages/faculty/AddAssignmentPage';
import AnalyticsPage from '../pages/faculty/AnalyticsPage';
import FacultyProfilePage from '../pages/faculty/ProfilePage';

// Admin Pages
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboardPage from '../pages/admin/DashboardPage';
import BatchesPage from '../pages/admin/BatchesPage';
import BatchDetailsPage from '../pages/admin/BatchDetailsPage';
import AddBatchPage from '../pages/admin/AddBatchPage';
import CoursesPage from '../pages/admin/CoursesPage';
import CourseDetailsPage from "../pages/admin/CourseDetailsPage";
import AddCoursePage from "../pages/admin/AddCoursePage";
import AdminSubjectsPage from '../pages/admin/SubjectsPage';
import SubjectDetailsPage from "../pages/admin/SubjectDetailsPage";
import AddSubjectPage from "../pages/admin/AddSubjectPage";
import StudentsPage from '../pages/admin/StudentsPage';
import StudentDetailsPage from "../pages/admin/StudentDetailsPage";
import AddStudentPage from "../pages/admin/AddStudentPage";
import FacultyPage from '../pages/admin/FacultyPage';
import FacultyDetailsPage from "../pages/admin/FacultyDetailsPage";
import AddFacultyPage from "../pages/admin/AddFacultyPage";
import AdminProfilePage from '../pages/admin/ProfilePage';
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
        <Route path="subjects" element={<StudentSubjectsPage />} />
        <Route path="subjects/:subjectKey" element={<StudentAssignmentsPage />} />
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="assignments" element={<StudentSubjectsPage />} />
        <Route path="assignments/:id" element={<AssignmentDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
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
        <Route path="dashboard" element={<FacultyDashboardPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="assignments" element={<FacultyAssignmentsPage />} />
        <Route path="add-assignment" element={<AddAssignmentPage />} />
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
        <Route path="batches/new" element={<AddBatchPage />} />
        <Route path="batches/:batchId/edit" element={<AddBatchPage />} />
        <Route path="batches/:batchId" element={<BatchDetailsPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/new" element={<AddCoursePage />} />
        <Route path="courses/:courseId/edit" element={<AddCoursePage />} />
        <Route path="courses/:courseId" element={<CourseDetailsPage />} />
        <Route path="subjects" element={<AdminSubjectsPage />} />
        <Route path="subjects/new" element={<AddSubjectPage />} />
        <Route path="subjects/:subjectId/edit" element={<AddSubjectPage />} />
        <Route path="subjects/:subjectId" element={<SubjectDetailsPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="students/new" element={<AddStudentPage />} />
        <Route path="students/:studentId/edit" element={<AddStudentPage />} />
        <Route path="students/:studentId" element={<StudentDetailsPage />} />
        <Route path="faculty" element={<FacultyPage />} />
        <Route path="faculty/new" element={<AddFacultyPage />} />
        <Route path="faculty/:facultyId/edit" element={<AddFacultyPage />} />
        <Route path="faculty/:facultyId" element={<FacultyDetailsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
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
