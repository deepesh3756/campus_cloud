import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UploadModal from "../../components/common/UploadModal";
import StudentBreadcrumb from "../../components/common/StudentBreadcrumb";
import { toast } from "react-toastify";
import { assignmentService } from "../../services/api/assignmentService";
import { validateFile } from "../../utils/fileValidator";
import { formatDate } from "../../utils/dateFormatter";

const AssignmentsPage = () => {
  const navigate = useNavigate();
  const { subjectKey } = useParams();
  const location = useLocation();
  const subjectNameFromState = location?.state?.subjectName;
  const batchCourseSubjectIdFromState = location?.state?.batchCourseSubjectId;

  const batchCourseSubjectId = useMemo(() => {
    if (batchCourseSubjectIdFromState != null) return Number(batchCourseSubjectIdFromState);
    const parsed = Number(subjectKey);
    return Number.isFinite(parsed) ? parsed : null;
  }, [batchCourseSubjectIdFromState, subjectKey]);

  const subjectTitle = useMemo(() => {
    if (!subjectKey) return "My Assignments";
    return `${subjectNameFromState || subjectKey} Assignments`;
  }, [subjectKey, subjectNameFromState]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assignments, setAssignments] = useState([]);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState(null);

  useEffect(() => {
    if (!batchCourseSubjectId) {
      setAssignments([]);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [assignmentsResp, submissionsResp] = await Promise.all([
          assignmentService.getAssignmentsBySubject(batchCourseSubjectId),
          assignmentService.getMySubmissions(),
        ]);

        if (!mounted) return;

        const submissions = Array.isArray(submissionsResp) ? submissionsResp : [];
        const submissionsByAssignmentId = new Map(
          submissions
            .filter((s) => s && s.assignmentId != null)
            .map((s) => [Number(s.assignmentId), s])
        );

        const normalized = (Array.isArray(assignmentsResp) ? assignmentsResp : []).map((a) => {
          const assignmentId = a?.assignmentId;
          const sub = assignmentId != null ? submissionsByAssignmentId.get(Number(assignmentId)) : null;
          const rawStatus = sub?.status ? String(sub.status) : "Pending";
          const status = rawStatus === "NOT_SUBMITTED" ? "Pending" : rawStatus;

          return {
            id: assignmentId,
            name: a?.title ?? "",
            createdDate: a?.createdAt ?? null,
            dueDate: a?.dueDate ?? null,
            status,
            grade: sub?.grade ?? "",
            remarks: sub?.remarks ?? "NA",
          };
        });

        setAssignments(normalized);
      } catch (e) {
        if (!mounted) return;
        setError(e);
        setAssignments([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [batchCourseSubjectId]);

  const openUpload = (assignment) => {
    setActiveAssignment(assignment);
    setIsUploadOpen(true);
  };

  const closeUpload = () => {
    setIsUploadOpen(false);
    setActiveAssignment(null);
  };

  const statusBadgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "submitted")
      return "badge bg-success-subtle text-success border";
    if (s === "evaluated")
      return "badge bg-primary-subtle text-primary border";
    return "badge bg-warning-subtle text-warning border";
  };

  const handleRowOpen = (assignmentId) => {
    navigate(`/student/assignments/${assignmentId}`, {
      state: {
        subjectKey,
        subjectName: subjectNameFromState,
        batchCourseSubjectId,
      },
    });
  };

  if (loading) return <div className="py-4">Loading...</div>;
  if (error) return <div className="py-4">Failed to load assignments</div>;

  return (
    <div className="assignments-hero container-fluid">
      <div className="mb-3">
        {subjectKey ? (
          <StudentBreadcrumb
            items={[
              {
                label: subjectNameFromState || subjectKey,
                to: `/student/subjects?subject=${encodeURIComponent(subjectKey)}`,
              },
            ]}
          />
        ) : null}
        <h2 className="fw-semibold">{subjectTitle}</h2>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle assignments-table">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 70 }}>S.No</th>
                  <th>Assignment Name</th>
                  <th style={{ width: 140 }}>Created Date</th>
                  <th style={{ width: 120 }}>Due Date</th>
                  <th style={{ width: 130 }}>Status</th>
                  <th style={{ width: 120 }}>Grade</th>
                  <th style={{ width: 200 }}>Remarks</th>
                  <th style={{ width: 140 }} className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {assignments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center text-muted py-4"
                    >
                      No assignments found
                    </td>
                  </tr>
                ) : (
                  assignments.map((a, idx) => (
                    <tr key={a.id}>
                      <td
                        className="text-muted assignment-click"
                        onClick={() => handleRowOpen(a.id)}
                        role="button"
                      >
                        {idx + 1}
                      </td>

                      <td
                        className="assignment-click fw-medium"
                        onClick={() => handleRowOpen(a.id)}
                        role="button"
                      >
                        {a.name}
                      </td>

                      <td className="text-muted">{a.createdDate ? formatDate(a.createdDate) : ""}</td>
                      <td className="text-muted">{a.dueDate ? formatDate(a.dueDate) : ""}</td>

                      <td>
                        <span className={statusBadgeClass(a.status)}>
                          {a.status}
                        </span>
                      </td>

                      <td className="text-muted">
                        {a.grade ?? ""}
                      </td>

                      <td className="text-muted">
                        {a.remarks ?? "NA"}
                      </td>

                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => handleRowOpen(a.id)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="btn btn-primary ms-2"
                          onClick={() => openUpload(a)}
                          disabled={
                            ["submitted", "evaluated"].includes(String(a.status || "").toLowerCase())
                          }
                        >
                          <i className="bi bi-upload"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🔽 ONLY THIS PART WAS EXTRACTED */}
      <UploadModal
        isOpen={isUploadOpen}
        title={
          activeAssignment
            ? `Upload: ${activeAssignment.name}`
            : "Upload"
        }
        onClose={closeUpload}
        maxSizeText="Maximum size: 10MB"
        onSubmit={async (file) => {
          const validation = validateFile(file, { maxSize: 10 * 1024 * 1024 });
          if (!validation.isValid) {
            toast.error(validation.error);
            return;
          }

          const assignmentId = activeAssignment?.id;
          if (!assignmentId) return;

          try {
            await assignmentService.submitAssignmentFile(assignmentId, file);
            closeUpload();
            toast.success("Assignment submitted successfully");

            // Refresh list after submit
            if (batchCourseSubjectId) {
              setLoading(true);
              const [assignmentsResp, submissionsResp] = await Promise.all([
                assignmentService.getAssignmentsBySubject(batchCourseSubjectId),
                assignmentService.getMySubmissions(),
              ]);

              const submissions = Array.isArray(submissionsResp) ? submissionsResp : [];
              const submissionsByAssignmentId = new Map(
                submissions
                  .filter((s) => s && s.assignmentId != null)
                  .map((s) => [Number(s.assignmentId), s])
              );

              const normalized = (Array.isArray(assignmentsResp) ? assignmentsResp : []).map((a) => {
                const aid = a?.assignmentId;
                const sub = aid != null ? submissionsByAssignmentId.get(Number(aid)) : null;
                const rawStatus = sub?.status ? String(sub.status) : "Pending";
                const status = rawStatus === "NOT_SUBMITTED" ? "Pending" : rawStatus;

                return {
                  id: aid,
                  name: a?.title ?? "",
                  createdDate: a?.createdAt ?? null,
                  dueDate: a?.dueDate ?? null,
                  status,
                  grade: sub?.grade ?? "",
                  remarks: sub?.remarks ?? "NA",
                };
              });
              setAssignments(normalized);
            }
          } catch {
            toast.error("Failed to submit assignment");
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
};

export default AssignmentsPage;
