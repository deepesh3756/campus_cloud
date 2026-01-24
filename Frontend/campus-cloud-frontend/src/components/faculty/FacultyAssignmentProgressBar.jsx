const FacultyAssignmentProgressBar = ({ label, value }) => {
  const safeValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div className="text-muted small">{label}</div>
        <div className="text-muted small">{safeValue}%</div>
      </div>

      <div className="progress" style={{ height: 6 }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${safeValue}%`, backgroundColor: "#5B5CE6" }}
          aria-valuenow={safeValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default FacultyAssignmentProgressBar;
