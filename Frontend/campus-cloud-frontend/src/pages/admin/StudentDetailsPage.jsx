import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, User } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import academicService from "../../services/api/academicService";
import userService from "../../services/api/userService";
import { toast } from "react-toastify";

const StudentDetailsPage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    let isMounted = true;

    const fetchStudent = async () => {
      setLoading(true);
      setError(null);
      try {
        const profile = await userService.getUserProfile(studentId);
        if (!isMounted) return;
        setStudent(profile || null);

        try {
          const enr = await academicService.getStudentEnrollments(profile?.userId ?? studentId);
          if (isMounted) setEnrollments(Array.isArray(enr) ? enr : []);
        } catch {
          if (isMounted) setEnrollments([]);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load student");
        setStudent(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStudent();
    return () => {
      isMounted = false;
    };
  }, [studentId]);

  const breadcrumbItems = useMemo(() => {
    const label = student ? `${student.firstName || ""} ${student.lastName || ""}`.trim() : "Student";
    return [{ label: "Students", to: "/admin/students" }, { label }];
  }, [student]);

  const handleConfirmDelete = async () => {
    if (!student?.userId) return;
    setDeleting(true);
    try {
      await userService.updateUserStatus(student.userId, "INACTIVE");
      toast.success("Student deleted successfully", { autoClose: 2500 });
      navigate("/admin/students");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete student", { autoClose: 3500 });
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="student-details-page">
        <AdminBreadcrumb items={[{ label: "Students", to: "/admin/students" }, { label: "Student" }]} />
        <div className="text-secondary">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-details-page">
        <AdminBreadcrumb items={[{ label: "Students", to: "/admin/students" }, { label: "Student" }]} />
        <div className="text-danger">{error}</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-details-page">
        <AdminBreadcrumb items={[{ label: "Students", to: "/admin/students" }, { label: "Student" }]} />
        <div className="text-secondary">Student not found.</div>
      </div>
    );
  }

  const primaryEnrollment = Array.isArray(enrollments) && enrollments.length ? enrollments[0] : null;

  return (
    <div className="student-details-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <ConfirmDeleteModal
        isOpen={deleteOpen}
        title="Delete Student"
        message={student ? `Are you sure you want to delete ${student.prn || "this student"}?` : "Are you sure you want to delete?"}
        loading={deleting}
        onCancel={() => (deleting ? null : setDeleteOpen(false))}
        onConfirm={handleConfirmDelete}
      />

      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
        <h4 className="fw-bold mb-0">Student details</h4>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-light border d-inline-flex align-items-center gap-2"
            onClick={() => navigate("/admin/students", { state: { editUserId: student.userId } })}
          >
            <Pencil size={16} />
            Edit Student
          </button>
          <button
            type="button"
            className="btn btn-danger d-inline-flex align-items-center gap-2"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 size={16} />
            Delete Student
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-start justify-content-between gap-4 flex-wrap">
            <div style={{ minWidth: 280 }}>
              <h5 className="fw-bold mb-3">Student Information</h5>

              <div className="mb-3">
                <div className="text-secondary" style={{ fontSize: 12 }}>
                  PRN
                </div>
                <div className="fw-semibold">{student.prn}</div>
              </div>

              <div className="mb-3">
                <div className="text-secondary" style={{ fontSize: 12 }}>
                  Student Full Name
                </div>
                <div className="fw-semibold">{student.firstName} {student.lastName}</div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Email
                  </div>
                  <div className="fw-semibold">{student.email}</div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Batch
                  </div>
                  <div className="fw-semibold">{primaryEnrollment?.batchName || "-"}</div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Mobile
                  </div>
                  <div className="fw-semibold">{student.mobile}</div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Course
                  </div>
                  <div className="fw-semibold">{primaryEnrollment?.courseCode || "-"}</div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Gender
                  </div>
                  <div className="fw-semibold">{student.gender}</div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Password
                  </div>
                  <div className="fw-semibold">********</div>
                </div>
              </div>
            </div>

            <div
              className="d-flex align-items-center justify-content-center border"
              style={{ width: 140, height: 110, borderRadius: 12, background: "#f3f4f6" }}
            >
              <User size={36} className="text-secondary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPage;
