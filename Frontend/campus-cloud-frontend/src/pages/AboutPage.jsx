import { Cloud, Users, BookOpen, Award } from "lucide-react";
import SiteNavbar from "../components/common/SiteNavbar";
import SiteFooter from "../components/common/SiteFooter";
import Sidebar from "../components/common/Sidebar";

const AboutPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* NAVBAR */}
      <SiteNavbar />

      {/* MAIN CONTENT WITH SIDEBAR */}
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div className="container py-5">

      {/* ================= HERO ================= */}
      <div className="text-center mb-5">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-4 bg-primary text-white mb-4"
          style={{ width:50, height: 50, fontSize: "35px" }}
        >
          ☁
        </div>

        <h1 className="fw-bold fs-2">About Campus Cloud</h1>

        <p className="text-muted fs-5 mt-3">
          A comprehensive learning management system designed for DAC students and
          faculty at CDAC.
        </p>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="row g-4 mb-5">

        {/* Students */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm text-center p-4">
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: 48,
                height: 48,
                background: "rgba(13,110,253,0.1)",
                color: "#0d6efd",
              }}
            >
              <Users size={22} />
            </div>

            <h5 className="fw-semibold">For Students</h5>

            <p className="text-muted small mt-2">
              View profiles, receive assignments, upload submissions, and track
              evaluation status.
            </p>
          </div>
        </div>

        {/* Faculty */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm text-center p-4">
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: 48,
                height: 48,
                background: "rgba(25,135,84,0.1)",
                color: "#198754",
              }}
            >
              <BookOpen size={22} />
            </div>

            <h5 className="fw-semibold">For Faculty</h5>

            <p className="text-muted small mt-2">
              Upload assignments, manage students, evaluate submissions, and
              view analytics.
            </p>
          </div>
        </div>

        {/* Centralized */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm text-center p-4">
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: 48,
                height: 48,
                background: "rgba(255,193,7,0.15)",
                color: "#ffc107",
              }}
            >
              <Award size={22} />
            </div>

            <h5 className="fw-semibold">Centralized Platform</h5>

            <p className="text-muted small mt-2">
              One platform for all academic needs — assignments,
              deadlines, and evaluations.
            </p>
          </div>
        </div>
      </div>

      {/* ================= MISSION ================= */}
      <div className="card border-0 shadow-sm p-4 p-md-5">
        <h4 className="fw-semibold mb-3">Our Mission</h4>

        <p className="text-muted mb-3" style={{ lineHeight: 1.7 }}>
          Campus Cloud aims to streamline the academic workflow for CDAC’s
          diploma programs. By providing a centralized platform for assignment
          management, submission tracking, and evaluation, we help both
          students and faculty focus on what matters most — learning and teaching.
        </p>

        <p className="text-muted" style={{ lineHeight: 1.7 }}>
          Built with modern web technologies, Campus Cloud offers a seamless
          experience across devices, ensuring that academic activities are never
          hindered by technical limitations.
        </p>
      </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
};

export default AboutPage;
