import DashboardHeader from "../../components/student/DashboardHeader";
import AssignmentStatusSummary from "../../components/student/AssignmentStatusSummary";

import "../../components/student/Dashboard.css";

const DashboardPage = () => {
  return (
    <div className="page-container">

      {/* Page title */}
      <DashboardHeader />

      {/* Assignment status cards */}
      <AssignmentStatusSummary />

    </div>
  );
};

export default DashboardPage;
