import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const CoursesPage = () => {
  const navigate = useNavigate();
  const [selectedBatchId, setSelectedBatchId] = useState("aug-2025");

  const batches = useMemo(
    () => [
      { id: "aug-2025", name: "August-2025" },
      { id: "feb-2025", name: "February-2025" },
    ],
    []
  );

  const initialCourses = useMemo(
    () => [
      {
        id: "pg-dac-aug-2025",
        batchId: "aug-2025",
        code: "PG-DAC",
        startDate: "2025-08-01",
        endDate: "2026-02-01",
        totalStudents: 223,
        subjects: "Data Structures, Core Java, Java based Web, MS .Net",
        status: "Active",
      },
      {
        id: "pg-dvlsi-aug-2025",
        batchId: "aug-2025",
        code: "PG-DVLSI",
        startDate: "2025-08-01",
        endDate: "2026-02-01",
        totalStudents: 34,
        subjects: "Marketing, Finance, HR Management",
        status: "Active",
      },
      {
        id: "pg-dbda-aug-2025",
        batchId: "aug-2025",
        code: "PG-DBDA",
        startDate: "2025-08-01",
        endDate: "2026-02-01",
        totalStudents: 58,
        subjects: "Data Science, MySql, Oracle, Hadoop",
        status: "Active",
      },
      {
        id: "pg-dai-aug-2025",
        batchId: "aug-2025",
        code: "PG-DAI",
        startDate: "2025-08-01",
        endDate: "2026-02-01",
        totalStudents: 40,
        subjects: "Machine Learning, Deep learning, Discreate maths",
        status: "Active",
      },
      {
        id: "pg-dtss-aug-2025",
        batchId: "aug-2025",
        code: "PG-DTSS",
        startDate: "2025-08-01",
        endDate: "2026-02-01",
        totalStudents: 36,
        subjects: "Thermodynamics, Fluid Mechanics",
        status: "Active",
      },
    ],
    []
  );

  const [courses, setCourses] = useState(initialCourses);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || null;

  const filteredCourses = courses.filter((c) => c.batchId === selectedBatchId);

  const breadcrumbItems = selectedBatch
    ? [
        { label: "Courses", to: "/admin/courses" },
        { label: selectedBatch.name },
      ]
    : [{ label: "Courses" }];

  const getStatusBadgeClass = (status) => {
    if (status === "Active") return "badge rounded-pill text-bg-primary";
    return "badge rounded-pill text-bg-light border text-secondary";
  };

  const handleDelete = (course) => {
    const ok = window.confirm(
      "Are you sure you want to delete this course? This will remove related data like subjects, students and assignments."
    );
    if (!ok) return;
    setCourses((prev) => prev.filter((c) => c.id !== course.id));
  };

  return (
    <div className="courses-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <h4 className="fw-bold mb-0">Course List</h4>

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

            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              onClick={() => navigate("/admin/courses/new")}
            >
              <Plus size={18} />
              Add Course
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
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 140 }}>
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 120 }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((course, idx) => (
                  <tr key={course.id}>
                    <td className="px-4 py-3 text-secondary text-center">{idx + 1}</td>

                    <td className="px-4 py-3 text-center">
                      <NavLink
                        to={`/admin/courses/${course.id}`}
                        className="text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/admin/courses/${course.id}`);
                        }}
                        style={{ color: "#4f46e5", fontWeight: 600 }}
                      >
                        {course.code}
                      </NavLink>
                    </td>

                    <td className="px-4 py-3 text-secondary text-center" style={{ whiteSpace: "nowrap" }}>
                      {course.startDate}
                    </td>

                    <td className="px-4 py-3 text-secondary text-center" style={{ whiteSpace: "nowrap" }}>
                      {course.endDate}
                    </td>

                    <td className="px-4 py-3 text-secondary text-center">{course.totalStudents}</td>

                    <td className="px-4 py-3 text-secondary" style={{ minWidth: 260 }}>
                      {course.subjects}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={getStatusBadgeClass(course.status)}>{course.status}</span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="d-inline-flex align-items-center gap-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-secondary"
                          onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-danger"
                          onClick={() => handleDelete(course)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!filteredCourses.length ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={8}>
                      No courses found.
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

export default CoursesPage;
