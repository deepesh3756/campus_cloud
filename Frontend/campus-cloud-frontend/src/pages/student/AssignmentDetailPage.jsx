import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import AssignmentHeroSection from "../../components/student/AssignmentHeroSection";
import AssignmentAttachmentsSection from "../../components/student/AssignmentAttachmentsSection";
import AssignmentSubmissionSection from "../../components/student/AssignmentSubmissionSection";
import PdfViewer from "../../components/common/PdfViewer";
import StudentBreadcrumb from "../../components/common/StudentBreadcrumb";
import { toast } from "react-toastify";

import { assignmentService } from "../../services/api/assignmentService";
import { validateFile } from "../../utils/fileValidator";

const sanitizeFilename = (name) => {
  return String(name || "")
    .trim()
    .replace(/[/\\]/g, "_");
};

const getFilenameFromUrl = (url) => {
  if (!url) return "";
  try {
    const u = new URL(url);
    const path = u.pathname || "";
    const base = path.substring(path.lastIndexOf("/") + 1);
    return decodeURIComponent(base || "");
  } catch {
    const s = String(url);
    const withoutQuery = s.split("?")[0];
    const base = withoutQuery.substring(withoutQuery.lastIndexOf("/") + 1);
    return base || "";
  }
};

const extensionFromMimeType = (mimeType) => {
  const m = String(mimeType || "").toLowerCase();
  if (!m) return "";
  if (m.includes("pdf")) return ".pdf";
  if (m.includes("zip")) return ".zip";
  if (m.includes("msword")) return ".doc";
  if (m.includes("wordprocessingml")) return ".docx";
  if (m.includes("vnd.ms-powerpoint")) return ".ppt";
  if (m.includes("presentationml")) return ".pptx";
  if (m.includes("plain")) return ".txt";
  if (m.startsWith("image/")) {
    const subtype = m.split("/")[1];
    return subtype ? `.${subtype}` : "";
  }
  return "";
};

const ensureFilenameHasExtension = ({ filename, mimeType, url }) => {
  const base = sanitizeFilename(filename) || sanitizeFilename(getFilenameFromUrl(url)) || "assignment_attachment";
  if (/\.[a-z0-9]{1,8}$/i.test(base)) return base;
  const ext = extensionFromMimeType(mimeType);
  return ext ? `${base}${ext}` : base;
};

const triggerBrowserDownload = async ({ url, filename }) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
};

const SUBJECT_LABELS = {
  cpp: "C++",
  dbms: "Database Technologies",
  java: "OOP with Java",
  dsa: "Algorithms & Data Structures",
  web: "Web Programming Technologies",
  dotnet: "Microsoft .NET Technologies",
};

const AssignmentDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const subjectKey = location?.state?.subjectKey;
  const subjectName = location?.state?.subjectName;
  const batchCourseSubjectId = location?.state?.batchCourseSubjectId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const assignmentId = Number(id);
        const [a, s] = await Promise.all([
          assignmentService.getAssignmentById(assignmentId),
          assignmentService.getMySubmission(assignmentId),
        ]);

        if (!mounted) return;
        setAssignment(a);
        setMySubmission(s);
      } catch (e) {
        if (!mounted) return;
        setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const attachments = useMemo(() => {
    if (!assignment) return [];
    if (!assignment.fileUrl) return [];
    return [
      {
        id: `assignment-${assignment.assignmentId}`,
        name: assignment.fileName || "Assignment File",
        type: assignment.mimeType || "",
        url: assignment.fileUrl,
      },
    ];
  }, [assignment]);

  const isPdfAttachment = useMemo(() => {
    const mime = (assignment?.mimeType || "").toLowerCase();
    const name = (assignment?.fileName || "").toLowerCase();
    return Boolean(assignment?.fileUrl) && (mime.includes("pdf") || name.endsWith(".pdf"));
  }, [assignment]);

  useEffect(() => {
    let mounted = true;
    let objectUrl = null;

    (async () => {
      if (!isPdfAttachment) {
        setPreviewBlobUrl(null);
        return;
      }
      try {
        const assignmentId = Number(id);
        const blob = await assignmentService.getAssignmentPreviewBlob(assignmentId);
        objectUrl = URL.createObjectURL(blob);
        if (!mounted) return;
        setPreviewBlobUrl(objectUrl);
      } catch {
        if (!mounted) return;
        setPreviewBlobUrl(null);
      }
    })();

    return () => {
      mounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, isPdfAttachment]);

  const submissionStatus = useMemo(() => {
    const raw = mySubmission?.status ? String(mySubmission.status) : "NOT_SUBMITTED";
    return raw === "NOT_SUBMITTED" ? "Pending" : raw;
  }, [mySubmission]);

  if (loading)
  return (
    <div className="container-fluid px-4 py-4">

      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="placeholder col-3 me-2"></span>
        <span className="placeholder col-2"></span>
      </div>

      {/* Assignment Card */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">

          {/* Title + Status */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="placeholder-glow w-50 mb-0">
              <span className="placeholder col-6"></span>
            </h4>

            <span className="badge bg-secondary placeholder col-2">
              &nbsp;
            </span>
          </div>

          {/* Due Date */}
          <p className="placeholder-glow mb-3">
            <span className="placeholder col-3 me-2"></span>
            <span className="placeholder col-2"></span>
          </p>

          <hr />

          {/* Description */}
          <h6 className="mb-2">
            <span className="placeholder col-2"></span>
          </h6>

          <p className="placeholder-glow">
            <span className="placeholder col-8"></span>
            <span className="placeholder col-6"></span>
            <span className="placeholder col-4"></span>
          </p>

        </div>
      </div>

      {/* Attachments */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">

          <h6 className="mb-3">
            <span className="placeholder col-2"></span>
          </h6>

          <div className="d-flex align-items-center justify-content-between border rounded p-3">
            <div className="w-75 placeholder-glow">
              <span className="placeholder col-5"></span>
              <br />
              <span className="placeholder col-3"></span>
            </div>

            <span className="btn btn-primary disabled placeholder col-2">
              &nbsp;
            </span>
          </div>

        </div>
      </div>
    </div>
  );


  if (error) return <div className="py-4">Failed to load assignment details</div>;

  return (
    <div className="assignment-detail-page container-fluid">
      {subjectKey ? (
        <StudentBreadcrumb
          items={[
            { label: "Home", to: "/student" },
            { label: "Subjects", to: "/student/subjects" },
            {
              label: subjectName || (SUBJECT_LABELS[subjectKey] ?? subjectKey),
              to: `/student/subjects/${encodeURIComponent(String(subjectKey))}`,
              state: {
                subjectKey,
                subjectName,
                batchCourseSubjectId,
              },
            },
            {
              label: assignment?.title || "Assignment",
            },
          ]}
        />
      ) : null}
      <AssignmentHeroSection
        title={assignment?.title || "Assignment"}
        description={assignment?.description}
        dueDate={assignment?.dueDate}
        status={submissionStatus}
      />

      <AssignmentAttachmentsSection
        attachments={attachments}
        onDownload={async (a) => {
          if (!a?.url) return;
          try {
            const filename = ensureFilenameHasExtension({
              filename: a?.name,
              mimeType: a?.type,
              url: a?.url,
            });
            await triggerBrowserDownload({ url: a.url, filename });
          } catch (e) {
            toast.error(e?.message || "Failed to download file");
          }
        }}
      />

      {/* Only show preview for PDF files that can be embedded */}
      {isPdfAttachment && previewBlobUrl ? (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-semibold mb-3">Preview</h5>
            <PdfViewer src={previewBlobUrl} title="Assignment PDF" height={520} />
          </div>
        </div>
      ) : null}

      <AssignmentSubmissionSection
        disabled={["submitted", "evaluated"].includes(String(submissionStatus || "").toLowerCase())}
        maxSizeText="Maximum size: 10MB"
        onSubmit={async (file) => {
          const validation = validateFile(file, { maxSize: 10 * 1024 * 1024 });
          if (!validation.isValid) {
            toast.error(validation.error);
            return;
          }

          try {
            const assignmentId = Number(id);
            await assignmentService.submitAssignmentFile(assignmentId, file);
            const s = await assignmentService.getMySubmission(assignmentId);
            setMySubmission(s);
            toast.success("Assignment submitted successfully");
          } catch {
            toast.error("Failed to submit assignment");
          }
        }}
        onCancel={() => {
          // UI-only cancel: clears selected file in the component
        }}
      />
    </div>
  );
};

export default AssignmentDetailPage;
