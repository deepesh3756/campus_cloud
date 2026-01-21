import Analytics from '../../components/faculty/Analytics';

const AnalyticsPage = () => {
  const analyticsData = {
    totalAssignments: 0,
    totalSubmissions: 0,
    averageMarks: 0,
    evaluationRate: 0,
  };

  return (
    <div className="analytics-page">
      <Analytics data={analyticsData} />
    </div>
  );
};

export default AnalyticsPage;
