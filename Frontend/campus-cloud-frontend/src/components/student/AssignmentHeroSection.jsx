import { formatDateTime } from "../../utils/dateFormatter";

const AssignmentHeroSection = ({
  title,
  shortDescription,
  description,
  dueDate,
  points,
  status,
}) => {
  const s = (status || "").toLowerCase();

  const badgeClass =
    s === "submitted"
      ? "badge bg-success-subtle text-success border"
      : s === "evaluated"
      ? "badge bg-primary-subtle text-primary border"
      : "badge bg-warning-subtle text-warning border";

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">

        {/* =====================
            TITLE
        ====================== */}
        <h3 className="fw-semibold mb-2">{title}</h3>

        {shortDescription && (
          <p className="text-muted mb-3">{shortDescription}</p>
        )}

        {/* =====================
            META INFO
        ====================== */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="text-muted small">Due Date</div>
            <div className="fw-medium">
              {dueDate ? formatDateTime(dueDate) : "N/A"}
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="text-muted small">Points</div>
            <div className="fw-medium">{points ?? "N/A"}</div>
          </div>

          <div className="col-12 col-md-4">
            <div className="text-muted small">Status</div>
            <span className={badgeClass}>{status || "Pending"}</span>
          </div>
        </div>

        {/* =====================
            DESCRIPTION
        ====================== */}
        {description && (
          <div className="border-top pt-4">
            <h6 className="fw-semibold mb-2">Description</h6>

            <div className="text-muted assignment-description">
              {Array.isArray(description) ? (
                <ol className="ps-3">
                  {description.map((item, index) => (
                    <li key={index} className="mb-1">
                      {item}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>{description}</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AssignmentHeroSection;
