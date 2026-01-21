import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const AdminLayout = () => {
  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/batches', label: 'Batches' },
    { path: '/admin/courses', label: 'Courses' },
    { path: '/admin/subjects', label: 'Subjects' },
    { path: '/admin/students', label: 'Students' },
    { path: '/admin/faculty', label: 'Faculty' },
  ];

  return (
    <div className="admin-layout">
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

export default AdminLayout;
