const SubmissionList = ({ submissions = [] }) => {
  if (submissions.length === 0) {
    return <div className="empty-state">No submissions found</div>;
  }

  return (
    <div className="submission-list">
      <table className="submission-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Submitted Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td>{submission.studentName}</td>
              <td>{submission.submittedDate}</td>
              <td>
                <span className={`status status-${submission.status}`}>
                  {submission.status}
                </span>
              </td>
              <td>
                <button onClick={() => {}}>Evaluate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionList;
