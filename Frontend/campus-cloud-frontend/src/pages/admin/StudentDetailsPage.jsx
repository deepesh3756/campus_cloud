import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, User } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const StudentDetailsPage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const students = useMemo(
    () => [
      {
        id: "123456789012",
        prn: "123456789012",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        mobile: "9876543210",
        gender: "Male",
        batchId: "aug-2025",
        batchName: "August-2025",
        courseId: "pg-dac-aug-2025",
        courseCode: "PG-DAC",
      },
      {
        id: "234567890123",
        prn: "234567890123",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        mobile: "8765432109",
        gender: "Female",
        batchId: "aug-2025",
        batchName: "August-2025",
        courseId: "pg-dac-aug-2025",
        courseCode: "PG-DAC",
      },
    ],
    []
  );

  const student = students.find((s) => s.id === studentId) || null;

  const breadcrumbItems = useMemo(() => {
    const label = student ? `${student.firstName} ${student.lastName}` : "Student";
    return [{ label: "Students", to: "/admin/students" }, { label }];
  }, [student]);

  const handleDelete = () => {
    const ok = window.confirm("Are you sure you want to delete this student?");
    if (!ok) return;
    navigate("/admin/students");
  };

  if (!student) {
    return (
      <div className="student-details-page">
        <AdminBreadcrumb items={[{ label: "Students", to: "/admin/students" }, { label: "Student" }]} />
        <div className="text-secondary">Student not found.</div>
      </div>
    );
  }

  return (
    <div className="student-details-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
        <h4 className="fw-bold mb-0">Student details</h4>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-light border d-inline-flex align-items-center gap-2"
            onClick={() => navigate(`/admin/students/${studentId}/edit`)}
          >
            <Pencil size={16} />
            Edit Student
          </button>
          <button
            type="button"
            className="btn btn-danger d-inline-flex align-items-center gap-2"
            onClick={handleDelete}
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
                  <div className="fw-semibold">{student.batchName}</div>
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
                  <div className="fw-semibold">{student.courseCode}</div>
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
