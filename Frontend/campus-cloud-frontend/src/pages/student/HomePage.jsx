import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import assignmentService from "../../services/api/assignmentService";

import SiteNavbar from "../../components/common/SiteNavbar";
import SiteFooter from "../../components/common/SiteFooter";

import UserWelcome from "../../components/common/UserWelcome";
import StatsCard from "../../components/student/StatsCard";

const HomePage = () => {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingAssignments = async () => {
      try {
        const data = await assignmentService.getPendingAssignments();
        const list = Array.isArray(data) ? data : [];
        setPendingCount(list.length);
      } catch (error) {
        console.error("Failed to fetch pending assignments:", error);
      }
    };

    fetchPendingAssignments();
  }, []);

  return (
    <div className="bg-light min-vh-100">

      
      <main className="container py-5">

        {/* Welcome */}
        <UserWelcome name={user?.firstName || "Student"} />

        {/* Stats cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <StatsCard
              title="Pending Assignments"
              count={String(pendingCount)}
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
          to="/student/subjects"
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



