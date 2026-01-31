import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import UserWelcome from "../../components/common/UserWelcome";
import StatsCard from "../../components/student/StatsCard";
import userService from "../../services/api/userService";
import assignmentService from "../../services/api/assignmentService";

const HomePage = () => {
  const [firstName, setFirstName] = useState("");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const me = await userService.getMe();
        if (!isMounted) return;
        setFirstName(me?.firstName || "");
      } catch {
        if (!isMounted) return;
        setFirstName("");
      }

      try {
        const pending = await assignmentService.getPendingAssignments();
        if (!isMounted) return;
        setPendingCount(Array.isArray(pending) ? pending.length : 0);
      } catch {
        if (!isMounted) return;
        setPendingCount(0);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-light min-vh-100">

      
      <main className="container py-5">

        {/* Welcome */}
        <UserWelcome name={firstName || "User"} />

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



