import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Download, Pencil, Trash2, Plus } from "lucide-react";
import JSZip from "jszip";
import { toast } from "react-toastify";

import CourseBreadcrumb from "../../components/faculty/CourseBreadcrumb";
import assignmentService from "../../services/api/assignmentService";

const AssignmentsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    batchId = null,
    batchName = null,
    courseCode = null,
    courseName = null,
    subjects = [],
    batchCourseSubjectId = null,
    subjectCode = null,
    subjectName = null,
  } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [downloadLoadingId, setDownloadLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [analyticsByAssignmentId, setAnalyticsByAssignmentId] = useState({});

  useEffect(() => {
    if (!batchCourseSubjectId) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await assignmentService.getAssignmentsBySubject(batchCourseSubjectId);
        if (!mounted) return;

        const list = (Array.isArray(data) ? data : []).slice().sort((a, b) => {
          const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
          return db - da;
        });

        setAssignments(list);
      } catch (e) {
        if (!mounted) return;
        setAssignments([]);
        setError(e?.response?.data?.message || "Failed to load assignments");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [batchCourseSubjectId]);

  useEffect(() => {
    if (!assignments.length) return;

    let mounted = true;
    (async () => {
      try {
        const pairs = await Promise.all(
          assignments.map(async (a) => {
            try {
              const analytics = await assignmentService.getAssignmentAnalytics(a.assignmentId);
              return [a.assignmentId, analytics];
            } catch {
              return [a.assignmentId, null];
            }
          })
        );

        if (!mounted) return;
        setAnalyticsByAssignmentId(Object.fromEntries(pairs));
      } catch {
        if (!mounted) return;
        setAnalyticsByAssignmentId({});
      }
    })();

    return () => {
      mounted = false;
    };
  }, [assignments]);

  const displayCourseName = useMemo(() => {
    return courseName || courseCode || "Course";
  }, [courseCode, courseName]);

  const formatDueDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString();
  };

  const handleAddAssignment = () => {
    navigate("/faculty/add-assignment", {
      state: {
        batchId,
        batchName,
        courseCode,
        courseName,
        subjects,
        batchCourseSubjectId,
        subjectCode,
        subjectName,
      },
    });
  };

  const handleOpenAnalytics = (assignment) => {
    navigate("/faculty/analytics", {
      state: {
        batchId,
        batchName,
        courseCode,
        courseName,
        subjects,
        batchCourseSubjectId,
        subjectCode,
        subjectName,
        assignmentId: assignment.assignmentId,
        assignmentTitle: assignment.title,
      },
    });
  };

  const handleBatchDownload = async (assignment) => {
    const assignmentId = assignment?.assignmentId;
    if (!assignmentId) return;

    try {
      setDownloadLoadingId(assignmentId);
      toast.info("Preparing download...");

      const submissions = await assignmentService.getSubmissions(assignmentId);
      const list = Array.isArray(submissions) ? submissions : [];
      const submitted = list.filter((s) => s?.fileUrl);

      if (submitted.length === 0) {
        toast.info("No submissions found for this assignment.");
        return;
      }

      const zip = new JSZip();
      const folder = zip.folder(`assignment_${assignmentId}`);

      for (const s of submitted) {
        const submissionId = s?.submissionId;
        if (!submissionId) continue;
        const namePart = (s?.studentPrn || s?.studentName || `student_${s?.studentUserId || ""}`)
          .toString()
          .replace(/[^a-z0-9-_ ]/gi, "_")
          .trim();

        const fileName = (s?.fileName || `submission_${submissionId}`).toString().replace(/[/\\]/g, "_");

        const { downloadUrl } = (await assignmentService.getSubmissionDownloadUrl(submissionId)) || {};
        const url = downloadUrl || s?.fileUrl;
        if (!url) continue;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to download submission ${submissionId}`);
        }
        const blob = await res.blob();
        folder.file(`${namePart}_${fileName}`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const blobUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${subjectCode || "subject"}_${assignmentId}_submissions.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);

      toast.success("Download started.");
    } catch (e) {
      toast.error(e?.message || "Failed to download submissions");
    } finally {
      setDownloadLoadingId(null);
    }
  };

  const handleEdit = (assignment) => {
    navigate("/faculty/add-assignment", {
      state: {
        mode: "edit",
        assignmentId: assignment?.assignmentId,
        batchId,
        batchName,
        courseCode,
        courseName,
        subjects,
        batchCourseSubjectId,
        subjectCode,
        subjectName,
      },
    });
  };

  const handleDelete = async (assignment) => {
    const assignmentId = assignment?.assignmentId;
    if (!assignmentId) return;

    const ok = window.confirm("Are you sure you want to delete this assignment?");
    if (!ok) return;

    try {
      await assignmentService.deleteAssignment(assignmentId);
      toast.success("Assignment deleted successfully.");
      setAssignments((prev) => prev.filter((a) => a?.assignmentId !== assignmentId));
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to delete assignment");
    }
  };

  return (
    <div className="container-fluid">
      <CourseBreadcrumb
        batchId={batchId}
        batchName={batchName}
        courseName={displayCourseName}
        subjectName={subjectName}
        state={location.state}
      />

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
            style={{
              borderRadius: 8,
              fontWeight: 600,
              color: "#111827",
            }}
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
            style={{
              borderRadius: 8,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Analytics
          </NavLink>
        </div>

        <button
          type="button"
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleAddAssignment}
          style={{ backgroundColor: "#5B5CE6", borderColor: "#5B5CE6" }}
        >
          <Plus size={16} />
          Add Assignment
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="p-4 pb-0">
            <h5 className="fw-semibold mb-3">Assignments</h5>
          </div>

          {!batchCourseSubjectId ? (
            <div className="px-4 pb-4">
              <div className="alert alert-warning mb-0">Please select a subject to view assignments.</div>
            </div>
          ) : null}

          {error ? (
            <div className="px-4 pb-4">
              <div className="alert alert-danger mb-0">{error}</div>
            </div>
          ) : null}

          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 80 }}>S.no</th>
                  <th>Title</th>
                  <th style={{ width: 140 }}>Due Date</th>
                  <th style={{ width: 220 }}>Progress</th>
                  <th style={{ width: 150 }} className="text-center">
                    Batch Download
                  </th>
                  <th style={{ width: 140 }} className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-muted">
                      Loading assignments...
                    </td>
                  </tr>
                ) : null}

                {!loading && assignments.length === 0 && batchCourseSubjectId ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-muted">
                      No assignments found.
                    </td>
                  </tr>
                ) : null}

                {assignments.map((a, idx) => {
                  const analytics = analyticsByAssignmentId[a.assignmentId];
                  const total = analytics?.totalStudents ?? 0;
                  const submitted = (analytics?.submittedCount ?? 0) + (analytics?.evaluatedCount ?? 0);
                  const progressPct = total > 0 ? Math.round((submitted * 100) / total) : 0;

                  return (
                  <tr key={a.assignmentId}>
                    <td>{idx + 1}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        style={{ color: "#111827", textDecoration: "underline" }}
                        onClick={() => handleOpenAnalytics(a)}
                      >
                        {a.title}
                      </button>
                    </td>
                    <td className="text-muted">{formatDueDate(a.dueDate)}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: 6 }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${progressPct}%`,
                              backgroundColor: "#5B5CE6",
                            }}
                            aria-valuenow={progressPct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <div className="text-muted small" style={{ minWidth: 70 }}>
                          {submitted}/{total}
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleBatchDownload(a)}
                        style={{ backgroundColor: "#5B5CE6", borderColor: "#5B5CE6" }}
                        aria-label="Batch download"
                        disabled={downloadLoadingId === a.assignmentId}
                      >
                        <Download size={16} />
                      </button>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-link p-0 me-3"
                        onClick={() => handleEdit(a)}
                        aria-label="Edit"
                        style={{ color: "#111827" }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => handleDelete(a)}
                        aria-label="Delete"
                        style={{ color: "#ef4444" }}
                      >
                        <Trash2 size={16} />
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
    </div>
  );
};

export default AssignmentsPage;
