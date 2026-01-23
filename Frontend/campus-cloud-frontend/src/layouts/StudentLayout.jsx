import { Outlet } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import "./StudentLayout.css";

const StudentLayout = () => {
  return (
  <div className="student-layout d-flex flex-column min-vh-100">
  <Navbar />

  <div className="d-flex flex-grow-1">
    <Sidebar />

    {/* THIS IS IMPORTANT */}
    <main className="main-content flex-grow-1 px-4 py-4">
      <Outlet />
    </main>
  </div>

  <Footer />
</div>

  );
};

export default StudentLayout;
