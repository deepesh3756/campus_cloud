import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipboardList, Pencil, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import academicService from "../../services/api/academicService";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import { toast } from "react-toastify";

const CourseDetailsPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const STORAGE_KEY = "admin_courses_selectedBatchId";

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedBatchName, setSelectedBatchName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    let isMounted = true;

    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await academicService.getBatchCourseById(courseId);
        if (isMounted) {
          setCourse(data || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load course");
          setCourse(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourse();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  useEffect(() => {
    if (!course) return;
    let isMounted = true;

    const resolveBatchName = async () => {
      let storedBatchId = "";
      try {
        storedBatchId = localStorage.getItem(STORAGE_KEY) || "";
      } catch {
        storedBatchId = "";
      }

      const courseBatchName = course?.batchName || "";
      const courseBatchId = course?.batchId;

      if (storedBatchId && courseBatchId && String(courseBatchId) === String(storedBatchId)) {
        setSelectedBatchName(courseBatchName);
        return;
      }

      if (storedBatchId) {
        try {
          const batches = await academicService.getBatches();
          const list = Array.isArray(batches) ? batches : [];
          const found = list.find((b) => String(b.batchId) === String(storedBatchId));
          if (isMounted) {
            setSelectedBatchName(found?.batchName || courseBatchName);
          }
          return;
        } catch {
          // ignore
        }
      }

      if (isMounted) {
        setSelectedBatchName(courseBatchName);
      }
    };

    resolveBatchName();
    return () => {
      isMounted = false;
    };
  }, [course]);

  const breadcrumbItems = useMemo(() => {
    const title = course?.courseCode || "Course";
    const batchLabel = selectedBatchName || course?.batchName;

    return batchLabel
      ? [{ label: "Courses", to: "/admin/courses" }, { label: batchLabel }, { label: title }]
      : [{ label: "Courses", to: "/admin/courses" }, { label: title }];
  }, [course?.courseCode, course?.batchName, selectedBatchName]);

  const getStatusBadgeClass = (status) => {
    if (status === "Active") return "badge rounded-pill text-bg-primary";
    return "badge rounded-pill text-bg-light border text-secondary";
  };

  const getApiErrorMessage = (err, fallback) => {
    const apiMessage = err?.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage;
    const message = err?.message;
    if (typeof message === "string" && message.trim()) return message;
    return fallback;
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.batchCourseId) return;
    setDeleting(true);
    // setError(null); // Optional: reset page-level error or handle via toast
    try {
      await academicService.deleteBatchCourse(deleteTarget.batchCourseId);
      toast.success("Course deleted successfully", { autoClose: 2500 });
      setDeleteTarget(null);
      navigate("/admin/courses");
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to delete course");
      toast.error(message, { autoClose: 3500 });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="course-details-page">
        <AdminBreadcrumb items={[{ label: "Courses", to: "/admin/courses" }, { label: "Course" }]} />
        <div className="text-secondary">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-details-page">
        <AdminBreadcrumb items={[{ label: "Courses", to: "/admin/courses" }, { label: "Course" }]} />
        <div className="text-danger">{error}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-details-page">
        <AdminBreadcrumb items={[{ label: "Courses", to: "/admin/courses" }, { label: "Course" }]} />
        <div className="text-secondary">Course not found.</div>
      </div>
    );
  }

  return (
    <div className="course-details-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Course"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.courseCode}? This will remove related data like subjects, students and assignments.`
            : "Are you sure you want to delete this course?"
        }
        loading={deleting}
        onCancel={() => (deleting ? null : setDeleteTarget(null))}
        onConfirm={handleConfirmDelete}
      />

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
            <div>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <h3 className="fw-bold mb-0">{course.courseCode}</h3>
                <span className={getStatusBadgeClass("Active")}>Active</span>
              </div>

              <div className="row g-3 mt-3">
                <div className="col-12 col-md-4">
                  <div className="text-secondary" style={{ fontSize: 13 }}>
                    Start Date
                  </div>
                  <div className="fw-semibold">{course.startDate}</div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="text-secondary" style={{ fontSize: 13 }}>
                    End Date
                  </div>
                  <div className="fw-semibold">{course.endDate}</div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="text-secondary" style={{ fontSize: 13 }}>
                    Total Students
                  </div>
                  <div className="fw-semibold">{typeof course.totalStudents === "number" ? course.totalStudents : "-"}</div>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-light border d-inline-flex align-items-center gap-2"
                onClick={() => navigate(`/admin/courses/${courseId}/edit`)}
              >
                <Pencil size={16} />
                Edit Course
              </button>
              <button
                type="button"
                className="btn btn-danger d-inline-flex align-items-center gap-2"
                onClick={() => setDeleteTarget(course)}
              >
                <Trash2 size={16} />
                Delete Course
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="fw-bold mb-3">Subjects in {course.courseCode}</h5>
            <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
              <div className="card-body p-0">
                {(Array.isArray(course.subjects) ? course.subjects : []).map((s) => (
                  <div
                    key={s.subjectId}
                    className="d-flex align-items-center gap-2 px-4 py-3 border-bottom"
                    style={{ fontSize: 14 }}
                  >
                    <ClipboardList size={16} className="text-secondary" />
                    <span>{s.subjectName}</span>
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

export default CourseDetailsPage;
