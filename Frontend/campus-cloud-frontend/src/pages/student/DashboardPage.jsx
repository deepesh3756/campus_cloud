import Dashboard from '../../components/student/Dashboard';

const DashboardPage = () => {
  const stats = {
    totalAssignments: 0,
    pendingAssignments: 0,
    submittedAssignments: 0,
    evaluatedAssignments: 0,
  };

  return (
    <div className="dashboard-page">
      <Dashboard stats={stats} />
    </div>
  );
};

export default DashboardPage;
