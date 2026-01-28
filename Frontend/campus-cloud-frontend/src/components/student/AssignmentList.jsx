import AssignmentCard from './AssignmentCard';

const AssignmentList = ({ assignments = [] }) => {
  if (assignments.length === 0) {
    return <div className="empty-state">No assignments found</div>;
  }

  return (
    <div className="assignment-list">
      {assignments.map((assignment) => (
        <AssignmentCard key={assignment.id} assignment={assignment} />
      ))}
    </div>
  );
};

export default AssignmentList;
