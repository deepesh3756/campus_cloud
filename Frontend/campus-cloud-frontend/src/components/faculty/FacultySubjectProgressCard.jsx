import FacultyAssignmentProgressBar from "./FacultyAssignmentProgressBar";

const FacultySubjectProgressCard = ({ title, assignments = [] }) => {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">
        <h6 className="fw-semibold mb-3">{title}</h6>

        {assignments.length === 0 ? (
          <div className="text-muted small">No assignments</div>
        ) : (
          assignments.map((a) => (
            <FacultyAssignmentProgressBar key={a.id} label={a.label} value={a.progress} />
          ))
        )}
      </div>
    </div>
  );
};

export default FacultySubjectProgressCard;
