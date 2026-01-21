import CreateAssignment from '../../components/faculty/CreateAssignment';
import SubmissionList from '../../components/faculty/SubmissionList';

const AssignmentsPage = () => {
  const handleCreateAssignment = (assignmentData) => {
    console.log('Creating assignment:', assignmentData);
  };

  return (
    <div className="faculty-assignments-page">
      <h2>Assignments</h2>
      <div className="assignments-section">
        <CreateAssignment onSubmit={handleCreateAssignment} />
        <SubmissionList submissions={[]} />
      </div>
    </div>
  );
};

export default AssignmentsPage;
