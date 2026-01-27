import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const FacultyPage = () => {
  const navigate = useNavigate();
  const [selectedBatchId, setSelectedBatchId] = useState("aug-2025");
  const [selectedCourseId, setSelectedCourseId] = useState("pg-dac-aug-2025");

  const batches = useMemo(
    () => [
      { id: "aug-2025", name: "August-2025" },
      { id: "feb-2025", name: "February-2025" },
    ],
    []
  );

  const courses = useMemo(
    () => [
      { id: "pg-dac-aug-2025", batchId: "aug-2025", code: "PG-DAC" },
      { id: "pg-dbda-aug-2025", batchId: "aug-2025", code: "PG-DBDA" },
      { id: "pg-dac-feb-2025", batchId: "feb-2025", code: "PG-DAC" },
    ],
    []
  );

  const initialFaculty = useMemo(
    () => [
      {
        id: "123456789012",
        batchId: "aug-2025",
        courseId: "pg-dac-aug-2025",
        name: "John Doe",
        email: "john.doe@example.com",
        mobile: "9876543210",
        activeCourses: ["PG-DAC", "PG-DAI"],
        status: "Active",
      },
      {
        id: "234567890123",
        batchId: "aug-2025",
        courseId: "pg-dac-aug-2025",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        mobile: "8765432109",
        activeCourses: ["PG-DVLSI"],
        status: "Inactive",
      },
      {
        id: "345678901234",
        batchId: "aug-2025",
        courseId: "pg-dbda-aug-2025",
        name: "Alice Johnson",
        email: "alice.j@example.com",
        mobile: "7654321098",
        activeCourses: ["PG_DBDA", "PG_DAI"],
        status: "Active",
      },
      {
        id: "456789012345",
        batchId: "feb-2025",
        courseId: "pg-dac-feb-2025",
        name: "Bob Williams",
        email: "bob.w@example.com",
        mobile: "6543210987",
        activeCourses: ["PG-DAC", "PG-DAI"],
        status: "Active",
      },
      {
        id: "567890123456",
        batchId: "feb-2025",
        courseId: "pg-dac-feb-2025",
        name: "Charlie Brown",
        email: "charlie.b@example.com",
        mobile: "5432109876",
        activeCourses: ["PG-DBDA"],
        status: "Inactive",
      },
    ],
    []
  );

  const [faculties, setFaculties] = useState(initialFaculty);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || null;
  const courseOptions = courses.filter((c) => c.batchId === selectedBatchId);
  const effectiveCourseId = courseOptions.some((c) => c.id === selectedCourseId)
    ? selectedCourseId
    : courseOptions[0]?.id || "";

  const selectedCourse = courseOptions.find((c) => c.id === effectiveCourseId) || null;

  const filteredFaculty = faculties.filter((f) => f.batchId === selectedBatchId && f.courseId === effectiveCourseId);

  const breadcrumbItems = selectedBatch
    ? selectedCourse
      ? [{ label: "Faculty", to: "/admin/faculty" }, { label: selectedBatch.name }, { label: selectedCourse.code }]
      : [{ label: "Faculty", to: "/admin/faculty" }, { label: selectedBatch.name }]
    : [{ label: "Faculty" }];

  const handleDelete = (faculty) => {
    const ok = window.confirm("Are you sure you want to delete this faculty?");
    if (!ok) return;
    setFaculties((prev) => prev.filter((f) => f.id !== faculty.id));
  };

  const handleToggleStatus = (faculty) => {
    setFaculties((prev) =>
      prev.map((f) =>
        f.id === faculty.id ? { ...f, status: f.status === "Active" ? "Inactive" : "Active" } : f
      )
    );
  };

  return (
    <div className="faculty-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <h4 className="fw-bold mb-0">Faculty List</h4>

              <div className="d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                <span className="text-secondary">Batch</span>
                <select
                  className="form-select"
                  style={{ width: 170 }}
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                <span className="text-secondary">Course</span>
                <select
                  className="form-select"
                  style={{ width: 150 }}
                  value={effectiveCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  disabled={!courseOptions.length}
                >
                  {courseOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              onClick={() => navigate("/admin/faculty/new")}
            >
              <Plus size={18} />
              Add Faculty
            </button>
          </div>

          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 80 }}>
                    S.no
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 170 }}>
                    Faculty ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 200 }}>
                    Faculty Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ minWidth: 240 }}>
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 160 }}>
                    Mobile
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 200 }}>
                    Active Courses
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 140 }}>
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 120 }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredFaculty.map((faculty, idx) => (
                  <tr key={faculty.id}>
                    <td className="px-4 py-3 text-secondary text-center">{idx + 1}</td>

                    <td className="px-4 py-3 text-center">
                      <NavLink
                        to={`/admin/faculty/${faculty.id}`}
                        className="text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/admin/faculty/${faculty.id}`);
                        }}
                        style={{ color: "#4f46e5", fontWeight: 600 }}
                      >
                        {faculty.id}
                      </NavLink>
                    </td>

                    <td className="px-4 py-3 text-secondary text-center">{faculty.name}</td>
                    <td className="px-4 py-3 text-secondary text-center">{faculty.email}</td>
                    <td className="px-4 py-3 text-secondary text-center">{faculty.mobile}</td>
                    <td className="px-4 py-3 text-secondary text-center">{faculty.activeCourses.join(", ")}</td>

                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div className="form-check form-switch m-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={faculty.status === "Active"}
                            onChange={() => handleToggleStatus(faculty)}
                          />
                        </div>
                        <span className={faculty.status === "Active" ? "text-secondary" : "text-muted"}>
                          {faculty.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="d-inline-flex align-items-center justify-content-center gap-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-secondary"
                          onClick={() => navigate(`/admin/faculty/${faculty.id}/edit`)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-danger"
                          onClick={() => handleDelete(faculty)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!filteredFaculty.length ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={8}>
                      No faculty found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyPage;
