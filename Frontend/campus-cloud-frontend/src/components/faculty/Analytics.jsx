const Analytics = ({ data }) => {
  return (
    <div className="analytics">
      <h2>Analytics</h2>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Assignments</h3>
          <p className="analytics-value">{data?.totalAssignments || 0}</p>
        </div>
        <div className="analytics-card">
          <h3>Submissions</h3>
          <p className="analytics-value">{data?.totalSubmissions || 0}</p>
        </div>
        <div className="analytics-card">
          <h3>Average Marks</h3>
          <p className="analytics-value">{data?.averageMarks || 0}</p>
        </div>
        <div className="analytics-card">
          <h3>Evaluation Rate</h3>
          <p className="analytics-value">{data?.evaluationRate || 0}%</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
