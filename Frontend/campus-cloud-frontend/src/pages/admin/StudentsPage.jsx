import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FileUp, Plus, Pencil, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const StudentsPage = () => {
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

  const initialStudents = useMemo(
    () => [
      {
        id: "123456789012",
        batchId: "aug-2025",
        courseId: "pg-dac-aug-2025",
        prn: "123456789012",
        name: "John Doe",
        email: "john.doe@example.com",
        mobile: "9876543210",
      },
      {
        id: "234567890123",
        batchId: "aug-2025",
        courseId: "pg-dac-aug-2025",
        prn: "234567890123",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        mobile: "8765432109",
      },
      {
        id: "345678901234",
        batchId: "aug-2025",
        courseId: "pg-dac-aug-2025",
        prn: "345678901234",
        name: "Alice Johnson",
        email: "alice.j@example.com",
        mobile: "7654321098",
      },
      {
        id: "456789012345",
        batchId: "aug-2025",
        courseId: "pg-dac-aug-2025",
        prn: "456789012345",
        name: "Bob Williams",
        email: "bob.w@example.com",
        mobile: "6543210987",
      },
      {
        id: "567890123456",
        batchId: "aug-2025",
        courseId: "pg-dac-aug-2025",
        prn: "567890123456",
        name: "Charlie Brown",
        email: "charlie.b@example.com",
        mobile: "5432109876",
      },
    ],
    []
  );

  const [students, setStudents] = useState(initialStudents);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || null;
  const courseOptions = courses.filter((c) => c.batchId === selectedBatchId);
  const effectiveCourseId = courseOptions.some((c) => c.id === selectedCourseId)
    ? selectedCourseId
    : courseOptions[0]?.id || "";

  const selectedCourse = courseOptions.find((c) => c.id === effectiveCourseId) || null;

  const filteredStudents = students.filter(
    (s) => s.batchId === selectedBatchId && s.courseId === effectiveCourseId
  );

  const breadcrumbItems = selectedBatch
    ? selectedCourse
      ? [
          { label: "Students", to: "/admin/students" },
          { label: selectedBatch.name },
          { label: selectedCourse.code },
        ]
      : [{ label: "Students", to: "/admin/students" }, { label: selectedBatch.name }]
    : [{ label: "Students" }];

  const handleDelete = (student) => {
    const ok = window.confirm("Are you sure you want to delete this student?");
    if (!ok) return;
    setStudents((prev) => prev.filter((s) => s.id !== student.id));
  };

  const handleImportCsv = () => {
    window.alert("CSV import is not implemented yet.");
  };

  return (
    <div className="students-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <h4 className="fw-bold mb-0">Student List</h4>

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

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                onClick={() => navigate("/admin/students/new")}
              >
                <Plus size={18} />
                Add Student
              </button>
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                onClick={handleImportCsv}
              >
                <FileUp size={18} />
                Import from csv
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 80 }}>
                    S.no
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 170 }}>
                    PRN (12 digits)
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 200 }}>
                    Student Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ minWidth: 240 }}>
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 160 }}>
                    Mobile
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 120 }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student, idx) => (
                  <tr key={student.id}>
                    <td className="px-4 py-3 text-secondary text-center">{idx + 1}</td>

                    <td className="px-4 py-3 text-center">
                      <NavLink
                        to={`/admin/students/${student.id}`}
                        className="text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/admin/students/${student.id}`);
                        }}
                        style={{ color: "#4f46e5", fontWeight: 600 }}
                      >
                        {student.prn}
                      </NavLink>
                    </td>

                    <td className="px-4 py-3 text-secondary text-center">{student.name}</td>
                    <td className="px-4 py-3 text-secondary text-center">{student.email}</td>
                    <td className="px-4 py-3 text-secondary text-center">{student.mobile}</td>

                    <td className="px-4 py-3">
                      <div className="d-inline-flex align-items-center gap-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-secondary"
                          onClick={() => navigate(`/admin/students/${student.id}/edit`)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-danger"
                          onClick={() => handleDelete(student)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!filteredStudents.length ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={6}>
                      No students found.
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

export default StudentsPage;
