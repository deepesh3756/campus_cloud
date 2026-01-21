import { useState, useEffect } from 'react';
import AssignmentList from '../../components/student/AssignmentList';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch assignments
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="assignments-page">
      <h2>My Assignments</h2>
      <AssignmentList assignments={assignments} />
    </div>
  );
};

export default AssignmentsPage;
