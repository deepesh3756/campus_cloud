import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, User } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const FacultyDetailsPage = () => {
  const navigate = useNavigate();
  const { facultyId } = useParams();

  const faculties = useMemo(
    () => [
      {
        id: "123456789012",
        code: "FAC0025",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        mobile: "9876543210",
        gender: "Male",
        batches: ["August-2025", "February-2026"],
        courses: ["PG-DBDA", "PG-DVLSI"],
        status: "Active",
      },
      {
        id: "234567890123",
        code: "FAC0031",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        mobile: "8765432109",
        gender: "Female",
        batches: ["August-2025"],
        courses: ["PG-DAC"],
        status: "Inactive",
      },
    ],
    []
  );

  const faculty = faculties.find((f) => f.id === facultyId) || null;

  const breadcrumbItems = useMemo(() => {
    const label = faculty ? `${faculty.firstName} ${faculty.lastName}` : "Faculty";
    return [{ label: "Faculty", to: "/admin/faculty" }, { label }];
  }, [faculty]);

  const handleDelete = () => {
    const ok = window.confirm("Are you sure you want to delete this faculty?");
    if (!ok) return;
    navigate("/admin/faculty");
  };

  if (!faculty) {
    return (
      <div className="faculty-details-page">
        <AdminBreadcrumb items={[{ label: "Faculty", to: "/admin/faculty" }, { label: "Faculty" }]} />
        <div className="text-secondary">Faculty not found.</div>
      </div>
    );
  }

  return (
    <div className="faculty-details-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
        <h4 className="fw-bold mb-0">Faculty details</h4>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-light border d-inline-flex align-items-center gap-2"
            onClick={() => navigate(`/admin/faculty/${facultyId}/edit`)}
          >
            <Pencil size={16} />
            Edit faculty
          </button>
          <button
            type="button"
            className="btn btn-danger d-inline-flex align-items-center gap-2"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
            Delete Faculty
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-start justify-content-between gap-4 flex-wrap">
            <div style={{ minWidth: 280 }}>
              <h5 className="fw-bold mb-3">Faculty Information</h5>

              <div className="mb-3">
                <div className="text-secondary" style={{ fontSize: 12 }}>
                  Faculty code
                </div>
                <div className="fw-semibold">{faculty.code}</div>
              </div>

              <div className="mb-3">
                <div className="text-secondary" style={{ fontSize: 12 }}>
                  Faculty Full Name
                </div>
                <div className="fw-semibold">
                  {faculty.firstName} {faculty.lastName}
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Email
                  </div>
                  <div className="fw-semibold">{faculty.email}</div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Batch(s)
                  </div>
                  <div className="fw-semibold">{faculty.batches.join(", ")}</div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Mobile
                  </div>
                  <div className="fw-semibold">{faculty.mobile}</div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Course
                  </div>
                  <div className="fw-semibold">{faculty.courses.join(", ")}</div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Gender
                  </div>
                  <div className="fw-semibold">{faculty.gender}</div>
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

export default FacultyDetailsPage;
