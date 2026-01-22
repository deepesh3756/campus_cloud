const AssignmentStatusCard = ({ title, total, data }) => {
  return (
    <div className="status-card">

      {/* HEADER */}
      <div className="status-card-header">
        <h5>{title}</h5>
        <span className="status-total">Total: {total}</span>
      </div>

      {/* TABLE */}
      <div className="status-table">
        <div className="status-row status-head">
          <span>Subject</span>
          <span>Count</span>
        </div>

        {data.map((item, index) => (
          <div className="status-row" key={index}>
            <span>{item.subject}</span>
            <span>{item.count}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AssignmentStatusCard;
