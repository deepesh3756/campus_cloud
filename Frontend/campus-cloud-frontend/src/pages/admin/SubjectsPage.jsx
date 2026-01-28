import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const SubjectsPage = () => {
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

  const initialSubjects = useMemo(
    () => [
      {
        id: "cpp01-aug-2025-pg-dac",
        batchId: "aug-2025",
        courseId: "pg-dac-aug-2025",
        name: "C++",
        code: "CPP01",
        faculties: "Madhuri",
        status: "Active",
      },
      {
        id: "ooj01-aug-2025-pg-dac",
        batchId: "aug-2025",
        courseId: "pg-dac-aug-2025",
        name: "Java",
        code: "OOJA1",
        faculties: "Pankaj, Dhananjay, Anu mitra",
        status: "Active",
      },
      {
        id: "dbt02-aug-2025-pg-dac",
        batchId: "aug-2025",
        courseId: "pg-dac-aug-2025",
        name: "Databases",
        code: "DBT02",
        faculties: "Swati",
        status: "Active",
      },
      {
        id: "ms003-aug-2025-pg-dac",
        batchId: "aug-2025",
        courseId: "pg-dac-aug-2025",
        name: "Microsoft .Net",
        code: "MS003",
        faculties: "Amit rajpoot, Atul wattam",
        status: "Active",
      },
      {
        id: "dsa01-aug-2025-pg-dac",
        batchId: "aug-2025",
        courseId: "pg-dac-aug-2025",
        name: "Data structures & Algorithms",
        code: "DSA01",
        faculties: "Nivendu",
        status: "Active",
      },
    ],
    []
  );

  const [subjects, setSubjects] = useState(initialSubjects);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || null;
  const courseOptions = courses.filter((c) => c.batchId === selectedBatchId);
  const effectiveCourseId = courseOptions.some((c) => c.id === selectedCourseId)
    ? selectedCourseId
    : courseOptions[0]?.id || "";

  const selectedCourse = courseOptions.find((c) => c.id === effectiveCourseId) || null;

  const filteredSubjects = subjects.filter(
    (s) => s.batchId === selectedBatchId && s.courseId === effectiveCourseId
  );

  const breadcrumbItems = selectedBatch
    ? selectedCourse
      ? [
          { label: "Subjects", to: "/admin/subjects" },
          { label: selectedBatch.name },
          { label: selectedCourse.code },
        ]
      : [{ label: "Subjects", to: "/admin/subjects" }, { label: selectedBatch.name }]
    : [{ label: "Subjects" }];

  const getStatusBadgeClass = (status) => {
    if (status === "Active") return "badge rounded-pill text-bg-primary";
    return "badge rounded-pill text-bg-light border text-secondary";
  };

  const handleDelete = (subject) => {
    const ok = window.confirm(
      "Are you sure you want to delete this subject? This will remove related data like students, faculty assignments and assignments."
    );
    if (!ok) return;
    setSubjects((prev) => prev.filter((s) => s.id !== subject.id));
  };

  return (
    <div className="subjects-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <h4 className="fw-bold mb-0">Subject List</h4>

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
              onClick={() => navigate("/admin/subjects/new")}
            >
              <Plus size={18} />
              Add Subject
            </button>
          </div>

          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 80 }}>
                    S.no
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 180 }}>
                    Subject Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 140 }}>
                    Subject Code
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ minWidth: 260 }}>
                    Faculty(s)
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
                {filteredSubjects.map((subject, idx) => (
                  <tr key={subject.id}>
                    <td className="px-4 py-3 text-secondary text-center">{idx + 1}</td>

                    <td className="px-4 py-3 text-center">
                      <NavLink
                        to={`/admin/subjects/${subject.id}`}
                        className="text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/admin/subjects/${subject.id}`);
                        }}
                        style={{ color: "#4f46e5", fontWeight: 600 }}
                      >
                        {subject.name}
                      </NavLink>
                    </td>

                    <td className="px-4 py-3 text-secondary text-center" style={{ whiteSpace: "nowrap" }}>
                      {subject.code}
                    </td>

                    <td className="px-4 py-3 text-secondary" style={{ minWidth: 260 }}>
                      {subject.faculties}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={getStatusBadgeClass(subject.status)}>{subject.status}</span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="d-inline-flex align-items-center gap-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-secondary"
                          onClick={() => navigate(`/admin/subjects/${subject.id}/edit`)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-danger"
                          onClick={() => handleDelete(subject)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!filteredSubjects.length ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={6}>
                      No subjects found.
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

export default SubjectsPage;
