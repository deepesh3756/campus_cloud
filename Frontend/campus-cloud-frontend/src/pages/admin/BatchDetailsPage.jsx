import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, FileText } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const BatchDetailsPage = () => {
  const navigate = useNavigate();
  const { batchId } = useParams();

  const batches = useMemo(
    () => [
      {
        id: "aug-2025",
        name: "August-2025",
        status: "Active",
        startDateLabel: "August 15, 2025",
        endDateLabel: "Feb 2, 2026",
        totalStudents: 340,
        courses: ["PG-DAC", "PG-DAI", "PG-DBDA", "PG-DTSS", "PG-VLSI", "PG-HPCSA"],
      },
      {
        id: "feb-2025",
        name: "February-2025",
        status: "Completed",
        startDateLabel: "Feb 20, 2025",
        endDateLabel: "Jul 20, 2025",
        totalStudents: 305,
        courses: ["PG-DAC", "PG-DAI", "PG-DBDA"],
      },
      {
        id: "aug-2024",
        name: "August-2024",
        status: "Completed",
        startDateLabel: "Aug 1, 2024",
        endDateLabel: "Feb 1, 2025",
        totalStudents: 289,
        courses: ["PG-DAC", "PG-DAI"],
      },
    ],
    []
  );

  const batch = batches.find((b) => b.id === batchId) || null;

  const breadcrumbItems = batch
    ? [
        { label: "Batches", to: "/admin/batches" },
        { label: batch.name },
      ]
    : [{ label: "Batches", to: "/admin/batches" }, { label: "Batch" }];

  const getStatusBadgeClass = (status) => {
    if (status === "Active") return "badge rounded-pill text-bg-primary";
    if (status === "Completed") return "badge rounded-pill text-bg-light border text-secondary";
    return "badge rounded-pill text-bg-light border text-secondary";
  };

  if (!batch) {
    return (
      <div className="batch-details-page">
        <AdminBreadcrumb items={breadcrumbItems} />
        <div className="alert alert-light border">Batch not found.</div>
      </div>
    );
  }

  return (
    <div className="batch-details-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-3 mb-2">
            <h2 className="fw-bold mb-0">{batch.name}</h2>
            <span className={getStatusBadgeClass(batch.status)}>{batch.status}</span>
          </div>

          <div className="row g-3" style={{ minWidth: 600 }}>
            <div className="col-4">
              <div className="text-secondary" style={{ fontSize: 13 }}>
                Start Date
              </div>
              <div className="fw-semibold">{batch.startDateLabel}</div>
            </div>

            <div className="col-4">
              <div className="text-secondary" style={{ fontSize: 13 }}>
                End Date
              </div>
              <div className="fw-semibold">{batch.endDateLabel}</div>
            </div>

            <div className="col-4">
              <div className="text-secondary" style={{ fontSize: 13 }}>
                Total Students
              </div>
              <div className="fw-semibold">{batch.totalStudents}</div>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-light border d-inline-flex align-items-center gap-2"
            onClick={() => navigate(`/admin/batches/${batchId}/edit`)}
          >
            <Pencil size={16} />
            Edit Batch
          </button>
          <button type="button" className="btn btn-danger d-inline-flex align-items-center gap-2">
            <Trash2 size={16} />
            Delete Batch
          </button>
        </div>
      </div>

      <div className="mb-2">
        <h5 className="fw-bold mb-3">Courses in {batch.name}</h5>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body">
          <div className="list-group list-group-flush">
            {batch.courses.map((course) => (
              <button
                type="button"
                key={course}
                className="list-group-item list-group-item-action d-flex align-items-center gap-2"
                onClick={() => navigate("/admin/courses")}
              >
                <FileText size={16} className="text-secondary" />
                <span className="fw-semibold">{course}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailsPage;
