import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Pencil, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import academicService from "../../services/api/academicService";

const SubjectDetailsPage = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subjectId) return;
    let isMounted = true;

    const fetchSubject = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await academicService.getBatchCourseSubjectById(subjectId);
        if (isMounted) {
          setSubject(data || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load subject");
          setSubject(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSubject();
    return () => {
      isMounted = false;
    };
  }, [subjectId]);

  const breadcrumbItems = useMemo(() => {
    const title = subject?.subjectName || "Subject";
    return [{ label: "Subjects", to: "/admin/subjects" }, { label: title }];
  }, [subject?.subjectName]);

  const getStatusBadgeClass = (status) => {
    if (status === "Active") return "badge rounded-pill text-bg-primary";
    return "badge rounded-pill text-bg-light border text-secondary";
  };

  const handleDelete = () => {
    const ok = window.confirm(
      "Are you sure you want to delete this subject? This will remove related data like students, faculty assignments and assignments."
    );
    if (!ok) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        await academicService.deleteBatchCourseSubject(subjectId);
        navigate("/admin/subjects");
      } catch (err) {
        setError(err?.message || "Failed to delete subject");
      } finally {
        setLoading(false);
      }
    })();
  };

  if (loading) {
    return (
      <div className="subject-details-page">
        <AdminBreadcrumb items={[{ label: "Subjects", to: "/admin/subjects" }, { label: "Subject" }]} />
        <div className="text-secondary">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subject-details-page">
        <AdminBreadcrumb items={[{ label: "Subjects", to: "/admin/subjects" }, { label: "Subject" }]} />
        <div className="text-danger">{error}</div>
      </div>
    );
  }

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
                <h3 className="fw-bold mb-0">{subject.subjectName}</h3>
                <span className={getStatusBadgeClass("Active")}>Active</span>
              </div>

              <div className="row g-3 mt-3">
                <div className="col-12 col-md-4">
                  <div className="text-secondary" style={{ fontSize: 13 }}>
                    Batch
                  </div>
                  <div className="fw-semibold">{subject.batchName}</div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="text-secondary" style={{ fontSize: 13 }}>
                    Course
                  </div>
                  <div className="fw-semibold">{subject.courseCode}</div>
                </div>
              
                <div className="col-12 col-md-4">
                  <div className="text-secondary" style={{ fontSize: 13 }}>
                    Subject Code
                  </div>
                  <div className="fw-semibold">{subject.subjectCode}</div>
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
                <div
                  className="d-flex align-items-center gap-2 px-4 py-3 border-bottom"
                  style={{ fontSize: 14 }}
                >
                  <User size={16} className="text-secondary" />
                  <span>-</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailsPage;
