import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Pencil, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const SubjectDetailsPage = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const subjects = useMemo(
    () => [
      {
        id: "cpp01-aug-2025-pg-dac",
        code: "CPP01",
        name: "C++",
        startDate: "2025-08-15",
        endDate: "2026-02-02",
        status: "Active",
        batchId: "aug-2025",
        batchName: "August-2025",
        courseId: "pg-dac-aug-2025",
        courseCode: "PG-DAC",
        faculties: ["Kishori Khadilkar", "Trupti sathe", "Jubera khan", "Shweta singh"],
      },
      {
        id: "ooj01-aug-2025-pg-dac",
        code: "OOJA1",
        name: "Java",
        startDate: "2025-08-01",
        endDate: "2026-02-01",
        status: "Active",
        batchId: "aug-2025",
        batchName: "August-2025",
        courseId: "pg-dac-aug-2025",
        courseCode: "PG-DAC",
        faculties: ["Pankaj", "Dhananjay", "Anu mitra"],
      },
    ],
    []
  );

  const subject = subjects.find((s) => s.id === subjectId) || null;

  const breadcrumbItems = useMemo(() => {
    const title = subject?.name || "Subject";
    return [{ label: "Subjects", to: "/admin/subjects" }, { label: title }];
  }, [subject?.name]);

  const getStatusBadgeClass = (status) => {
    if (status === "Active") return "badge rounded-pill text-bg-primary";
    return "badge rounded-pill text-bg-light border text-secondary";
  };

  const handleDelete = () => {
    const ok = window.confirm(
      "Are you sure you want to delete this subject? This will remove related data like students, faculty assignments and assignments."
    );
    if (!ok) return;

    navigate("/admin/subjects");
  };

  if (!subject) {
    return (
      <div className="subject-details-page">
        <AdminBreadcrumb items={[{ label: "Subjects", to: "/admin/subjects" }, { label: "Subject" }]} />
        <div className="text-secondary">Subject not found.</div>
      </div>
    );
  }

  return (
    <div className="subject-details-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
            <div>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <h3 className="fw-bold mb-0">{subject.name}</h3>
                <span className={getStatusBadgeClass(subject.status)}>{subject.status}</span>
              </div>

              <div className="row g-3 mt-3">
                <div className="col-12 col-md-4">
                  <div className="text-secondary" style={{ fontSize: 13 }}>
                    Start Date
                  </div>
                  <div className="fw-semibold">{subject.startDate}</div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="text-secondary" style={{ fontSize: 13 }}>
                    End Date
                  </div>
                  <div className="fw-semibold">{subject.endDate}</div>
                </div>
              
                <div className="col-12 col-md-4">
                  <div className="text-secondary" style={{ fontSize: 13 }}>
                    Total Faculties
                  </div>
                  <div className="fw-semibold">{subject.faculties.length}</div>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-light border d-inline-flex align-items-center gap-2"
                onClick={() => navigate(`/admin/subjects/${subjectId}/edit`)}
              >
                <Pencil size={16} />
                Edit Subject
              </button>
              <button
                type="button"
                className="btn btn-danger d-inline-flex align-items-center gap-2"
                onClick={handleDelete}
              >
                <Trash2 size={16} />
                Delete Subject
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="fw-bold mb-3">Faculties assigned</h5>
            <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
              <div className="card-body p-0">
                {subject.faculties.map((f) => (
                  <div
                    key={f}
                    className="d-flex align-items-center gap-2 px-4 py-3 border-bottom"
                    style={{ fontSize: 14 }}
                  >
                    <User size={16} className="text-secondary" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailsPage;
