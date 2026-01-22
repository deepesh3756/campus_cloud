import { Outlet } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";

const StudentLayout = () => {
  return (
    <div className="student-layout d-flex flex-column min-vh-100">

      {/* TOP NAVBAR */}
      <Navbar />

      {/* BODY */}
      <div className="d-flex flex-grow-1">

        {/* SIDEBAR */}
        <Sidebar />

        {/* PAGE CONTENT */}
        <main className="main-content flex-grow-1 p-4">
          <Outlet />
        </main>

      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default StudentLayout;
