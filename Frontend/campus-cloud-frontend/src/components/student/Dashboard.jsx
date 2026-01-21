const Dashboard = ({ stats }) => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats?.totalAssignments || 0}</h3>
          <p>Total Assignments</p>
        </div>
        <div className="stat-card">
          <h3>{stats?.pendingAssignments || 0}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{stats?.submittedAssignments || 0}</h3>
          <p>Submitted</p>
        </div>
        <div className="stat-card">
          <h3>{stats?.evaluatedAssignments || 0}</h3>
          <p>Evaluated</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
