import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import assignmentService from "../../services/api/assignmentService";

const SubjectsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignmentsBySubjectId, setAssignmentsBySubjectId] = useState({});

  const openAssignmentByKey = async (subject, assignmentKey) => {
    const batchCourseSubjectId = subject?.batchCourseSubjectId;
    if (!batchCourseSubjectId) return;

    try {
      let assignments = assignmentsBySubjectId[batchCourseSubjectId];
      if (!Array.isArray(assignments)) {
        const resp = await assignmentService.getAssignmentsBySubject(batchCourseSubjectId);
        assignments = Array.isArray(resp) ? resp : [];
        assignments.sort((a, b) => {
          const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
          return da - db;
        });

        setAssignmentsBySubjectId((prev) => ({
          ...prev,
          [batchCourseSubjectId]: assignments,
        }));
      }

      const idx = Number(assignmentKey) - 1;
      const target = Number.isFinite(idx) ? assignments[idx] : null;
      const assignmentId = target?.assignmentId;
      if (!assignmentId) {
        toast.error("Assignment not found");
        return;
      }

      navigate(`/student/assignments/${encodeURIComponent(String(assignmentId))}`, {
        state: {
          subjectKey: String(batchCourseSubjectId),
          subjectName: subject?.subjectName,
          batchCourseSubjectId,
        },
      });
    } catch {
      toast.error("Failed to open assignment");
    }
  };

  useEffect(() => {
    if (!user?.userId) return;
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await assignmentService.getStudentSubjectAssignments();
        if (!isMounted) return;
        setSubjects(Array.isArray(data) ? data : []);
      } catch {
        if (!isMounted) return;
        setSubjects([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [user?.userId]);

  const highlightedKey = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get("subject");
  }, [location.search]);

  
  

      

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <h2 className="fw-semibold">Subjects</h2>
      </div>

      <div className="card shadow-sm border rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle table-hover  mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 90 }}>S.No</th>
                  <th>Subject Name</th>
                  <th style={{ width: 360 }}>Assignments</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td className="text-center text-muted py-4" colSpan={3}>
                      Loading...
                    </td>
                  </tr>
                ) : null}

                {!loading
                  ? (Array.isArray(subjects) ? subjects : []).map((s, idx) => {
                      const label = s.subjectName || s.subjectCode || "Subject";
                      const key = String(s.batchCourseSubjectId ?? idx);
                      const isHighlighted = highlightedKey && highlightedKey === key;

                      const latestKey = Number(s.latestKey || 0);
                      const submittedSet = new Set(Array.isArray(s.submittedKeys) ? s.submittedKeys.map(Number) : []);

                      const visibleKeys = Array.from({ length: latestKey }).map((_, i) => i + 1);

                      const MAX_VISIBLE_PILLS = 12;
                      const visible = visibleKeys.slice(0, MAX_VISIBLE_PILLS);
                      const hiddenCount = Math.max(0, visibleKeys.length - visible.length);

                      return (
                        <tr key={key} style={isHighlighted ? { backgroundColor: "#eef2ff" } : undefined}>
                          <td className="text-muted">{idx + 1}</td>

                          <td className="fw-medium">
                            <Link
                              to={`/student/subjects/${encodeURIComponent(key)}`}
                              state={{ subjectName: s.subjectName, subjectCode: s.subjectCode, batchCourseSubjectId: s.batchCourseSubjectId }}
                              className="text-decoration-none"
                            >
                              {label}
                            </Link>
                          </td>

                          <td>
                            {latestKey ? (
                              <div
                                className="d-flex flex-wrap gap-2"
                                style={{ maxHeight: 84, overflow: "hidden" }}
                                title={hiddenCount ? visibleKeys.join(", ") : undefined}
                              >
                                {visible.map((n) => {
                                  const submitted = submittedSet.has(Number(n));
                                  return (
                                    <button
                                      key={`${key}-${n}`}
                                      type="button"
                                      className={
                                        submitted
                                          ? "badge rounded-pill text-white shadow-sm"
                                          : "badge rounded-pill bg-light text-secondary border"
                                      }
                                      style={{
                                        minWidth: 28,
                                        textAlign: "center",
                                        cursor: "pointer",
                                        border: "none",
                                        backgroundColor: submitted ? "rgb(100 108 255)" : undefined,
                                      }}
                                      onClick={() => openAssignmentByKey(s, n)}
                                    >
                                      {n}
                                    </button>
                                  );
                                })}

                                {hiddenCount ? (
                                  <span
                                    className="badge rounded-pill bg-light text-secondary border"
                                    style={{ minWidth: 36, textAlign: "center" }}
                                    title={visibleKeys.join(", ")}
                                  >
                                    +{hiddenCount}
                                  </span>
                                ) : null}
                              </div>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  : null}

                {!loading && !(Array.isArray(subjects) && subjects.length) ? (
                  <tr>
                    <td className="text-center text-muted py-4" colSpan={3}>
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
