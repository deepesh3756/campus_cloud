const StatsCard = ({ title, count, description }) => {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex justify-content-between align-items-center">

        <div>
          <h6 className="fw-semibold mb-2">{title}</h6>
          <h2 className="text-primary fw-bold mb-0">{count}</h2>
        </div>

        <div className="text-muted small text-end" style={{ maxWidth: 160 }}>
          {description}
        </div>

      </div>
    </div>
  );
};

export default StatsCard;
