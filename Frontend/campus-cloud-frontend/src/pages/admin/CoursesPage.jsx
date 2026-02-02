import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import academicService from "../../services/api/academicService";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import { toast } from "react-toastify";

const CoursesPage = () => {
  const navigate = useNavigate();

  const STORAGE_KEY = "admin_courses_selectedBatchId";
  const [selectedBatchId, setSelectedBatchId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });

  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeCourses, setActiveCourses] = useState([]);
  const [modalCourseId, setModalCourseId] = useState("");
  const [modalCourseName, setModalCourseName] = useState("");
  const [modalStartDate, setModalStartDate] = useState("");
  const [modalEndDate, setModalEndDate] = useState("");
  const [modalErrors, setModalErrors] = useState({});
  const [savingModal, setSavingModal] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getApiErrorMessage = (err, fallback) => {
    const apiMessage = err?.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage;
    const message = err?.message;
    if (typeof message === "string" && message.trim()) return message;
    return fallback;
  };

  const resetAddModal = () => {
    setModalCourseId("");
    setModalCourseName("");
    setModalStartDate(selectedBatch?.startDate || "");
    setModalEndDate(selectedBatch?.endDate || "");
    setModalErrors({});
  };

  const openAddModal = () => {
    resetAddModal();
    setIsAddModalOpen(true);
  };

  const validateAddModal = () => {
    const next = {};
    if (!selectedBatchId) next.batch = "Batch is required";
    if (!modalCourseId) next.course = "Please select a course";
    if (!modalStartDate) next.startDate = "Start Date is required";
    if (!modalEndDate) next.endDate = "End Date is required";
    setModalErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSaveAddModal = async () => {
    if (!validateAddModal()) return;

    const cid = Number(modalCourseId);
    if (Number.isNaN(cid) || cid <= 0) {
      toast.error("Invalid course selected", { autoClose: 3500 });
      return;
    }

    const picked = activeCourses.find((c) => String(c.courseId) === String(modalCourseId));
    const courseCode = picked?.courseCode || "";
    const batchName = selectedBatch?.batchName || "";

    setSavingModal(true);
    try {
      await academicService.createBatchCourse({
        batchId: Number(selectedBatchId),
        courseId: cid,
        startDate: modalStartDate,
        endDate: modalEndDate,
      });

      toast.success(`Course ${courseCode || ""} added to batch ${batchName || ""}`.trim(), { autoClose: 2500 });
      setIsAddModalOpen(false);

      const refreshed = await academicService.getCoursesByBatch(selectedBatchId);
      setCourses(Array.isArray(refreshed) ? refreshed : []);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to add course to batch"), { autoClose: 3500 });
    } finally {
      setSavingModal(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchBatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await academicService.getBatches();
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          setBatches(list);
          if (!list.length) return;

          setSelectedBatchId((prev) => {
            const prevValue = String(prev || "");
            const stillExists = list.some((b) => String(b.batchId) === prevValue);
            if (prevValue && stillExists) return prevValue;
            return String(list[0].batchId);
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load batches");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBatches();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      if (selectedBatchId) {
        localStorage.setItem(STORAGE_KEY, String(selectedBatchId));
      }
    } catch {
      // ignore
    }
  }, [selectedBatchId]);

  useEffect(() => {
    if (!selectedBatchId) return;

    let isMounted = true;

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await academicService.getCoursesByBatch(selectedBatchId);
        if (isMounted) {
          setCourses(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load courses");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [selectedBatchId]);

  useEffect(() => {
    let isMounted = true;
    const fetchActiveCourses = async () => {
      try {
        const data = await academicService.getCourses("ACTIVE");
        if (!isMounted) return;
        setActiveCourses(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      }
    };

    fetchActiveCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedBatch = batches.find((b) => String(b.batchId) === String(selectedBatchId)) || null;

  const filteredCourses = courses;

  const breadcrumbItems = selectedBatch
    ? [
        { label: "Courses", to: "/admin/courses" },
        { label: selectedBatch.batchName },
      ]
    : [{ label: "Courses" }];

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.batchCourseId) return;
    setDeleting(true);
    setError(null);
    try {
      await academicService.deleteBatchCourse(deleteTarget.batchCourseId);
      setCourses((prev) => prev.filter((c) => c.batchCourseId !== deleteTarget.batchCourseId));
      toast.success("Course deleted successfully", { autoClose: 2500 });
      setDeleteTarget(null);
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to delete course");
      setError(message);
      toast.error(message, { autoClose: 3500 });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="courses-page">
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

      {isAddModalOpen ? (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.45)" }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 14 }}>
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Course to Batch</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => (savingModal ? null : setIsAddModalOpen(false))}
                />
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Course Code</label>
                    <select
                      className={`form-select ${modalErrors.course ? "is-invalid" : ""}`}
                      value={modalCourseId}
                      onChange={(e) => {
                        const value = e.target.value;
                        setModalCourseId(value);
                        setModalErrors({});
                        const picked = activeCourses.find((c) => String(c.courseId) === String(value));
                        setModalCourseName(picked?.courseName || "");
                      }}
                      disabled={savingModal}
                    >
                      <option value="" disabled>
                        Select course
                      </option>
                      {activeCourses.map((c) => (
                        <option key={c.courseId} value={c.courseId}>
                          {c.courseCode}
                        </option>
                      ))}
                    </select>
                    {modalErrors.course ? <div className="invalid-feedback">{modalErrors.course}</div> : null}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Course Name</label>
                    <input type="text" className="form-control" value={modalCourseName} readOnly />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Start Date</label>
                    <input
                      type="date"
                      className={`form-control ${modalErrors.startDate ? "is-invalid" : ""}`}
                      value={modalStartDate}
                      onChange={(e) => setModalStartDate(e.target.value)}
                      disabled={savingModal}
                    />
                    {modalErrors.startDate ? <div className="invalid-feedback">{modalErrors.startDate}</div> : null}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">End Date</label>
                    <input
                      type="date"
                      className={`form-control ${modalErrors.endDate ? "is-invalid" : ""}`}
                      value={modalEndDate}
                      onChange={(e) => setModalEndDate(e.target.value)}
                      disabled={savingModal}
                    />
                    {modalErrors.endDate ? <div className="invalid-feedback">{modalErrors.endDate}</div> : null}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light border"
                  onClick={() => (savingModal ? null : setIsAddModalOpen(false))}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveAddModal}
                  disabled={savingModal}
                >
                  {savingModal ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <h4 className="fw-bold mb-0">Course List</h4>

              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary">Batch</span>
                <select
                  className="form-select"
                  style={{ width: 170 }}
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                >
                  {batches.map((b) => (
                    <option key={b.batchId} value={b.batchId}>
                      {b.batchName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              onClick={() => navigate("/admin/courses/new")}
              disabled={!selectedBatchId}
            >
              <Plus size={18} />
              Add New Course
            </button>
          </div>

          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 80 }}>
                    S.no
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 160 }}>
                    Course Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 140 }}>
                    Start Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 140 }}>
                    End Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 160 }}>
                    Total Students
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ minWidth: 260 }}>
                    Subjects
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 120 }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={7}>
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-danger" colSpan={7}>
                      {error}
                    </td>
                  </tr>
                ) : filteredCourses.length ? (
                  filteredCourses.map((course, idx) => (
                    <tr key={course.batchCourseId}>
                    <td className="px-4 py-3 text-secondary text-center">{idx + 1}</td>

                    <td className="px-4 py-3 text-center">
                      <NavLink
                        to={`/admin/courses/${course.batchCourseId}`}
                        className="text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/admin/courses/${course.batchCourseId}`);
                        }}
                        style={{ color: "#4f46e5", fontWeight: 600 }}
                      >
                        {course.courseCode}
                      </NavLink>
                    </td>

                    <td className="px-4 py-3 text-secondary text-center" style={{ whiteSpace: "nowrap" }}>
                      {course.startDate}
                    </td>

                    <td className="px-4 py-3 text-secondary text-center" style={{ whiteSpace: "nowrap" }}>
                      {course.endDate}
                    </td>

                    <td className="px-4 py-3 text-secondary text-center">
                      {typeof course.totalStudents === "number" ? course.totalStudents : "-"}
                    </td>

                    <td className="px-4 py-3 text-secondary text-center" style={{ minWidth: 260 }}>
                      {typeof course.totalSubjects === "number" ? course.totalSubjects : "-"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="d-inline-flex align-items-center gap-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-danger"
                          onClick={() => setDeleteTarget(course)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={7}>
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td className="px-4 py-3" colSpan={7}>
                    <button
                      type="button"
                      className="btn btn-light border w-100 d-inline-flex align-items-center justify-content-center gap-2"
                      style={{ backgroundColor: "#f1f3f5" }}
                      onClick={openAddModal}
                      disabled={!selectedBatchId}
                    >
                      <Plus size={18} />
                      Add Course to Batch
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
