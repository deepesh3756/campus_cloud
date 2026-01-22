import { Link } from "react-router-dom";

import SiteNavbar from "../../components/common/SiteNavbar";
import SiteFooter from "../../components/common/SiteFooter";

import UserWelcome from "../../components/common/UserWelcome";
import StatsCard from "../../components/student/StatsCard";

const HomePage = () => {
  return (
    <div className="bg-light min-vh-100">

      
      <main className="container py-5">

        {/* Welcome */}
        <UserWelcome name="Mohit" />

        {/* Stats cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <StatsCard
              title="Pending Assignments"
              count="3"
              description="Assignments requiring your attention."
            />
          </div>

          <div className="col-md-6">
            <StatsCard
              title="Unread Notifications"
              count="2"
              description="New alerts and announcements."
            />
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/assignments"
          className="text-decoration-none"
        >
          <div className="card bg-primary text-white border-0 shadow-sm">
            <div className="card-body p-4 d-flex justify-content-between align-items-center">

              <div>
                <h4 className="fw-bold mb-2">Your Assignments</h4>
                <p className="mb-0 opacity-75">
                  View all your current, pending, and submitted assignments.
                  Stay on top of your academic progress.
                </p>
              </div>

              <div className="fs-2 fw-bold">
                →
              </div>

            </div>
          </div>
        </Link>

      </main>

    

    </div>
  );
};

export default HomePage;



