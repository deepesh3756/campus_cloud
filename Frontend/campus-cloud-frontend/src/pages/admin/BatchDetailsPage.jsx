import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, FileText } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import academicService from "../../services/api/academicService";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import { toast } from "react-toastify";

const BatchDetailsPage = () => {
  const navigate = useNavigate();
  const { batchId } = useParams();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getApiErrorMessage = (err, fallback) => {
    const apiMessage = err?.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage;
    const message = err?.message;
    if (typeof message === "string" && message.trim()) return message;
    return fallback;
  };

  const handleConfirmDelete = async () => {
    if (!batchId) return;
    setDeleting(true);
    try {
      await academicService.deleteBatch(batchId);
      toast.success("Batch deleted successfully", { autoClose: 2500 });
      navigate("/admin/batches");
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to delete batch");
      toast.error(message, { autoClose: 3500 });
      setConfirmDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!batchId) return;
    let isMounted = true;

    const fetchBatch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await academicService.getBatchById(batchId);
        if (isMounted) {
          setBatch(data || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load batch");
          setBatch(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBatch();
    return () => {
      isMounted = false;
    };
  }, [batchId]);

  const breadcrumbItems = useMemo(() => {
    const title = batch?.batchName || "Batch";
    return [{ label: "Batches", to: "/admin/batches" }, { label: title }];
  }, [batch?.batchName]);

  const getStatusBadgeClass = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "ACTIVE") return "badge rounded-pill text-bg-primary";
    if (s === "COMPLETED") return "badge rounded-pill text-bg-light border text-secondary";
    return "badge rounded-pill text-bg-light border text-secondary";
  };

  if (loading) {
    return (
      <div className="batch-details-page">
        <AdminBreadcrumb items={[{ label: "Batches", to: "/admin/batches" }, { label: "Batch" }]} />
        <div className="text-secondary">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="batch-details-page">
        <AdminBreadcrumb items={[{ label: "Batches", to: "/admin/batches" }, { label: "Batch" }]} />
        <div className="text-danger">{error}</div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="batch-details-page">
        <AdminBreadcrumb items={breadcrumbItems} />
        <div className="alert alert-light border">Batch not found.</div>
      </div>
    );
  }

  const courses = Array.isArray(batch.courses) ? batch.courses : [];

  return (
    <div className="batch-details-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <ConfirmDeleteModal
        isOpen={confirmDeleteOpen}
        title="Delete Batch"
        message={batch ? `Are you sure you want to delete ${batch.batchName}?` : "Are you sure you want to delete?"}
        loading={deleting}
        onCancel={() => (deleting ? null : setConfirmDeleteOpen(false))}
        onConfirm={handleConfirmDelete}
      />

      <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-3 mb-2">
            <h2 className="fw-bold mb-0">{batch.batchName}</h2>
            <span className={getStatusBadgeClass(batch.status)}>{batch.status}</span>
          </div>

          <div className="row g-3" style={{ minWidth: 600 }}>
            <div className="col-4">
              <div className="text-secondary" style={{ fontSize: 13 }}>
                Start Date
              </div>
              <div className="fw-semibold">{batch.startDate}</div>
            </div>

            <div className="col-4">
              <div className="text-secondary" style={{ fontSize: 13 }}>
                End Date
              </div>
              <div className="fw-semibold">{batch.endDate}</div>
            </div>

            <div className="col-4">
              <div className="text-secondary" style={{ fontSize: 13 }}>
                Total Courses
              </div>
              <div className="fw-semibold">{typeof batch.totalCourses === "number" ? batch.totalCourses : "-"}</div>
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
          <button
            type="button"
            className="btn btn-danger d-inline-flex align-items-center gap-2"
            onClick={() => setConfirmDeleteOpen(true)}
          >
            <Trash2 size={16} />
            Delete Batch
          </button>
        </div>
      </div>

      <div className="mb-2">
        <h5 className="fw-bold mb-3">Courses in {batch.batchName}</h5>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body">
          <div className="list-group list-group-flush">
            {courses.length ? courses.map((course) => (
              <button
                type="button"
                key={course.courseId}
                className="list-group-item list-group-item-action d-flex align-items-center gap-2"
                onClick={() => navigate("/admin/courses")}
              >
                <FileText size={16} className="text-secondary" />
                <span className="fw-semibold">{course.courseCode}</span>
              </button>
            )) : (
              <div className="list-group-item text-secondary">No courses found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailsPage;
