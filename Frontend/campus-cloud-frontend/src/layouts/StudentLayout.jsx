import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const StudentLayout = () => {
  const menuItems = [
    { path: '/student/dashboard', label: 'Dashboard' },
    { path: '/student/assignments', label: 'Assignments' },
    { path: '/student/profile', label: 'Profile' },
  ];

  return (
    <div className="student-layout">
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

export default StudentLayout;
