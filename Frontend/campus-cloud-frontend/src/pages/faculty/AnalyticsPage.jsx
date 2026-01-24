import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Download } from "lucide-react";

import CourseBreadcrumb from "../../components/faculty/CourseBreadcrumb";
import { useFacultyData } from "../../context/FacultyContext";

const buildMockAssignments = (subjectId) => {
  if (!subjectId) return [];
  return [
    { id: "a1", title: "Introduction to C++" },
    { id: "a2", title: "Operating System Concepts" },
    { id: "a3", title: "Java Fundamentals" },
    { id: "a4", title: "Inheritance in Java" },
    { id: "a5", title: "Overriding in Java" },
  ].map((a) => ({ ...a, id: `${subjectId}-${a.id}` }));
};

const buildMockStudents = (count) => {
  return Array.from({ length: count }).map((_, i) => {
    const idx = i + 1;
    const submitted = idx % 4 !== 0;
    return {
      id: `s${idx}`,
      prn: `PRN${1000 + idx}`,
      name: `Student ${idx}`,
      submitted,
      grade: submitted ? String(((idx % 10) || 10)) : "",
      remarks: submitted ? "Good work on assignment" : "",
    };
  });
};

const AnalyticsPage = () => {
  const location = useLocation();
  const { getCourses, getCourseById } = useFacultyData();

  const courses = getCourses();

  const initialCourseId = location.state?.courseId || "";
  const initialSubjectId = location.state?.subjectId || "";
  const initialAssignmentId = location.state?.assignmentId || "";

  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(initialAssignmentId);

  const selectedCourse = useMemo(() => {
    if (!selectedCourseId) return null;
    return getCourseById(selectedCourseId);
  }, [getCourseById, selectedCourseId]);

  const subjects = useMemo(() => {
    return selectedCourse?.subjects || [];
  }, [selectedCourse]);

  const assignments = useMemo(() => {
    return buildMockAssignments(selectedSubjectId);
  }, [selectedSubjectId]);

  const showData = Boolean(selectedCourseId && selectedSubjectId && selectedAssignmentId);

  const students = useMemo(() => buildMockStudents(90), []);
  const submittedCount = useMemo(
    () => students.reduce((acc, s) => acc + (s.submitted ? 1 : 0), 0),
    [students]
  );

  const courseName = location.state?.courseName || selectedCourse?.code || "PG-DAC";
  const subjectName =
    location.state?.subjectName || subjects.find((s) => s.id === selectedSubjectId)?.name || null;

  const handleBatchDownload = () => {
    console.log("Batch download submissions", {
      courseId: selectedCourseId,
      subjectId: selectedSubjectId,
      assignmentId: selectedAssignmentId,
    });
  };

  const handleGridDownload = (student) => {
    if (!student.submitted) return;
    console.log("Download submission", { studentId: student.id, assignmentId: selectedAssignmentId });
  };

  const handleViewFile = (student) => {
    if (!student.submitted) return;
    console.log("View file", { studentId: student.id, assignmentId: selectedAssignmentId });
  };

  return (
    <div className="container-fluid">
      <CourseBreadcrumb courseName={courseName} subjectName={subjectName} />

      <div className="d-flex align-items-center justify-content-between mb-3">
        <div
          className="d-flex align-items-center"
          style={{
            background: "#f3f4f6",
            borderRadius: 10,
            padding: 6,
            minWidth: 420,
            maxWidth: 640,
            width: "100%",
          }}
        >
          <NavLink
            to="/faculty/assignments"
            state={location.state}
            className={({ isActive }) =>
              `btn btn-sm flex-fill ${isActive ? "btn-light" : "btn-outline-light"}`
            }
            style={{ borderRadius: 8, fontWeight: 600, color: "#111827" }}
            end
          >
            Assignments
          </NavLink>
          <NavLink
            to="/faculty/analytics"
            state={location.state}
            className={({ isActive }) =>
              `btn btn-sm flex-fill ${isActive ? "btn-light" : "btn-outline-light"}`
            }
            style={{ borderRadius: 8, fontWeight: 600, color: "#111827" }}
          >
            Analytics
          </NavLink>
        </div>

        <button
          type="button"
          className="btn btn-dark d-flex align-items-center gap-2"
          onClick={handleBatchDownload}
          disabled={!showData}
        >
          <Download size={16} />
          Batch Download
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
            <div style={{ minWidth: 220 }}>
              <select
                className="form-select"
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setSelectedSubjectId("");
                  setSelectedAssignmentId("");
                }}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: 220 }}>
              <select
                className="form-select"
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  setSelectedAssignmentId("");
                }}
                disabled={!selectedCourseId}
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: 240 }}>
              <select
                className="form-select"
                value={selectedAssignmentId}
                onChange={(e) => setSelectedAssignmentId(e.target.value)}
                disabled={!selectedCourseId || !selectedSubjectId}
              >
                <option value="">Select Assignment</option>
                {assignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!selectedCourseId || !selectedSubjectId ? (
            <div className="alert alert-warning py-2 mb-3">
              Please select a course and a subject to view assignments.
            </div>
          ) : null}

          {!showData ? null : (
            <>
              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    // 5 rows visible, then scroll for more
                    maxHeight: 182,
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, 32px)",
                      gap: 6,
                      justifyContent: "start",
                    }}
                  >
                    {students.map((s, idx) => {
                      const bg = s.submitted ? "rgba(70, 223, 126, 0.36)" : "#ffffff";
                      const border = s.submitted ? "rgba(34, 197, 94, 0.8)" : "#e5e7eb";
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleGridDownload(s)}
                          disabled={!s.submitted}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: `1px solid ${border}`,
                            background: bg,
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#111827",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            lineHeight: 1,
                            cursor: s.submitted ? "pointer" : "not-allowed",
                          }}
                          aria-label={`Student ${idx + 1}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <div className="p-4 pb-0">
                    <div className="d-flex align-items-baseline justify-content-between">
                      <div>
                        <h6 className="fw-semibold mb-1">Student Submissions</h6>
                        <div className="text-muted small">
                          Submitted: {submittedCount}/{students.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table mb-0 align-middle">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: 140 }}>PRN</th>
                          <th>Student Name</th>
                          <th style={{ width: 120 }}>Grade</th>
                          <th style={{ width: 260 }}>Remarks</th>
                          <th style={{ width: 150 }} className="text-center">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s) => {
                          const rowStyle = s.submitted
                            ? undefined
                            : { opacity: 0.5, pointerEvents: "none" };

                          return (
                            <tr key={s.id} style={rowStyle}>
                              <td className="text-muted">{s.prn}</td>
                              <td>{s.name}</td>
                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  defaultValue={s.grade}
                                  disabled={!s.submitted}
                                  onChange={(e) =>
                                    console.log("Grade change", {
                                      studentId: s.id,
                                      grade: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">-</option>
                                  {Array.from({ length: 10 }).map((_, i) => {
                                    const v = String(i + 1);
                                    return (
                                      <option key={v} value={v}>
                                        {v}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="Add remarks"
                                  defaultValue={s.remarks}
                                  disabled={!s.submitted}
                                  onChange={(e) =>
                                    console.log("Remarks change", {
                                      studentId: s.id,
                                      remarks: e.target.value,
                                    })
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => handleViewFile(s)}
                                  disabled={!s.submitted}
                                >
                                  View File
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
