import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const FacultyLayout = () => {
  const menuItems = [
    { path: '/faculty/dashboard', label: 'Dashboard' },
    { path: '/faculty/subjects', label: 'Subjects' },
    { path: '/faculty/assignments', label: 'Assignments' },
    { path: '/faculty/analytics', label: 'Analytics' },
    { path: '/faculty/profile', label: 'Profile' },
  ];

  return (
    <div className="faculty-layout">
      <Navbar />
      <div className="layout-content">
        <Sidebar menuItems={menuItems} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FacultyLayout;
