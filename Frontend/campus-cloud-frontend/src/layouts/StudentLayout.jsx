import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';

const StudentLayout = () => {
  return (
    <div className="student-layout">
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default StudentLayout;

