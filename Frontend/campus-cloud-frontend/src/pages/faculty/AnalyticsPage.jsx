import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import JSZip from "jszip";
import { toast } from "react-toastify";

import CourseBreadcrumb from "../../components/faculty/CourseBreadcrumb";
import { useAuth } from "../../hooks/useAuth";
import academicService from "../../services/api/academicService";
import assignmentService from "../../services/api/assignmentService";

const AnalyticsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const {
    batchId = null,
    batchName = null,
    courseCode = null,
    courseName = null,
    subjects: navSubjects = [],
    batchCourseSubjectId: navBatchCourseSubjectId = null,
    subjectCode = null,
    subjectName = null,
    assignmentId: navAssignmentId = null,
    assignmentTitle = null,
  } = location.state || {};

  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState(null);

  const [batches, setBatches] = useState([]);
  const [facultyAssignments, setFacultyAssignments] = useState([]);

  const [selectedBatchName, setSelectedBatchName] = useState(batchName || "");
  const [selectedCourseCode, setSelectedCourseCode] = useState(courseCode || "");
  const [selectedBatchCourseSubjectId, setSelectedBatchCourseSubjectId] = useState(
    navBatchCourseSubjectId || null
  );
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(navAssignmentId || null);

  const navAssignmentAppliedRef = useRef({ subjectId: null, assignmentId: null });

  const [assignmentOptions, setAssignmentOptions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [submissionDrafts, setSubmissionDrafts] = useState({});
  const [savingSubmissionIds, setSavingSubmissionIds] = useState(() => new Set());

  useEffect(() => {
    if (navBatchCourseSubjectId) {
      setFacultyAssignments([]);
      setBatches([]);
      return;
    }

    if (!user?.userId) return;

    let mounted = true;
    (async () => {
      try {
        setLoadingMeta(true);
        setError(null);
        const [b, a] = await Promise.all([
          academicService.getBatches(),
          academicService.getSubjectsByFaculty(user.userId),
        ]);

        if (!mounted) return;
        setBatches(Array.isArray(b) ? b : []);
        setFacultyAssignments(Array.isArray(a) ? a : []);

        if (!selectedBatchName) {
          const initial = batchName || (Array.isArray(a) && a[0]?.batchName) || "";
          setSelectedBatchName(initial);
        }
      } catch {
        if (!mounted) return;
        setError("Failed to load analytics context");
        setBatches([]);
        setFacultyAssignments([]);
      } finally {
        if (mounted) setLoadingMeta(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [batchName, navBatchCourseSubjectId, selectedBatchName, user?.userId]);

  const selectedBatchId = useMemo(() => {
    if (batchId) return batchId;
    if (!selectedBatchName) return null;
    const match = (Array.isArray(batches) ? batches : []).find((b) => b?.batchName === selectedBatchName);
    return match?.batchId ?? null;
  }, [batchId, batches, selectedBatchName]);

  const courses = useMemo(() => {
    const list = Array.isArray(facultyAssignments) ? facultyAssignments : [];
    const filtered = selectedBatchName ? list.filter((a) => a?.batchName === selectedBatchName) : [];

    const byCourse = new Map();
    filtered.forEach((a) => {
      const code = a?.courseCode;
      if (!code) return;
      if (!byCourse.has(code)) {
        byCourse.set(code, {
          courseCode: code,
          courseName: a?.courseName || code,
          subjects: [],
        });
      }
      byCourse.get(code).subjects.push({
        batchCourseSubjectId: a?.batchCourseSubjectId,
        subjectCode: a?.subjectCode,
        subjectName: a?.subjectName,
      });
    });

    return Array.from(byCourse.values());
  }, [facultyAssignments, selectedBatchName]);

  const subjectOptions = useMemo(() => {
    const selectedCourse = courses.find((c) => c.courseCode === selectedCourseCode);
    return selectedCourse?.subjects || [];
  }, [courses, selectedCourseCode]);

  useEffect(() => {
    if (!selectedCourseCode) {
      setSelectedBatchCourseSubjectId(null);
      setSelectedAssignmentId(null);
      setAssignmentOptions([]);
      return;
    }

    if (selectedBatchCourseSubjectId != null) return;
    const fromNav = navSubjects.find((s) => s?.batchCourseSubjectId === navBatchCourseSubjectId);
    if (fromNav?.batchCourseSubjectId) {
      setSelectedBatchCourseSubjectId(fromNav.batchCourseSubjectId);
      return;
    }
    if (subjectOptions.length === 1 && subjectOptions[0]?.batchCourseSubjectId != null) {
      setSelectedBatchCourseSubjectId(subjectOptions[0].batchCourseSubjectId);
    }
  }, [navBatchCourseSubjectId, navSubjects, selectedBatchCourseSubjectId, selectedCourseCode, subjectOptions]);

  useEffect(() => {
    if (!selectedBatchCourseSubjectId) {
      setAssignmentOptions([]);
      setSelectedAssignmentId(null);
      return;
    }

    if (navAssignmentAppliedRef.current.subjectId !== selectedBatchCourseSubjectId) {
      navAssignmentAppliedRef.current = {
        subjectId: selectedBatchCourseSubjectId,
        assignmentId: navAssignmentId || null,
      };
    }

    let mounted = true;
    (async () => {
      try {
        setLoadingAssignments(true);
        const data = await assignmentService.getAssignmentsBySubject(selectedBatchCourseSubjectId);
        if (!mounted) return;

        const list = (Array.isArray(data) ? data : []).slice().sort((a, b) => {
          const da = a?.createdAt ? new Date(a.createdAt).getTime() : Number.POSITIVE_INFINITY;
          const db = b?.createdAt ? new Date(b.createdAt).getTime() : Number.POSITIVE_INFINITY;
          const na = Number.isFinite(da) ? da : Number.POSITIVE_INFINITY;
          const nb = Number.isFinite(db) ? db : Number.POSITIVE_INFINITY;
          return na - nb;
        });

        setAssignmentOptions(list);

        const applyNavId = navAssignmentAppliedRef.current.assignmentId;
        if (
          applyNavId &&
          (selectedAssignmentId == null || selectedAssignmentId === applyNavId) &&
          list.some((x) => x?.assignmentId === applyNavId)
        ) {
          setSelectedAssignmentId(applyNavId);
          navAssignmentAppliedRef.current.assignmentId = null;
        } else if (!selectedAssignmentId && list.length) {
          setSelectedAssignmentId(list[0]?.assignmentId ?? null);
        }
      } catch {
        if (!mounted) return;
        setAssignmentOptions([]);
        setSelectedAssignmentId(null);
      } finally {
        if (mounted) setLoadingAssignments(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navAssignmentId, selectedAssignmentId, selectedBatchCourseSubjectId]);

  useEffect(() => {
    if (!selectedAssignmentId) {
      setSubmissions([]);
      setAnalytics(null);
      setSubmissionDrafts({});
      setSavingSubmissionIds(new Set());
      return;
    }

    let mounted = true;
    (async () => {
      try {
        setLoadingSubmissions(true);
        const [subs, a] = await Promise.all([
          assignmentService.getSubmissions(selectedAssignmentId),
          assignmentService.getAssignmentAnalytics(selectedAssignmentId),
        ]);
        if (!mounted) return;
        setSubmissions(Array.isArray(subs) ? subs : []);
        setAnalytics(a || null);
        setSubmissionDrafts({});
        setSavingSubmissionIds(new Set());
      } catch {
        if (!mounted) return;
        setSubmissions([]);
        setAnalytics(null);
        setSubmissionDrafts({});
        setSavingSubmissionIds(new Set());
      } finally {
        if (mounted) setLoadingSubmissions(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedAssignmentId]);

  const selectedCourseDisplay = useMemo(() => {
    return courseName || courses.find((c) => c.courseCode === selectedCourseCode)?.courseName || selectedCourseCode || "Course";
  }, [courseName, courses, selectedCourseCode]);

  const selectedSubjectDisplay = useMemo(() => {
    if (subjectName) return subjectName;
    const match = subjectOptions.find((s) => s?.batchCourseSubjectId === selectedBatchCourseSubjectId);
    return match?.subjectName || null;
  }, [selectedBatchCourseSubjectId, subjectName, subjectOptions]);

  const selectedStateForTabs = useMemo(() => {
    const match = subjectOptions.find((s) => s?.batchCourseSubjectId === selectedBatchCourseSubjectId);
    const resolvedSubjectCode = match?.subjectCode || subjectCode;
    const resolvedSubjectName = match?.subjectName || subjectName;

    return {
      batchId: selectedBatchId,
      batchName: selectedBatchName,
      courseCode: selectedCourseCode,
      courseName: selectedCourseDisplay,
      subjects: subjectOptions,
      batchCourseSubjectId: selectedBatchCourseSubjectId,
      subjectCode: resolvedSubjectCode,
      subjectName: resolvedSubjectName,
      assignmentId: selectedAssignmentId,
      assignmentTitle:
        assignmentTitle ||
        assignmentOptions.find((a) => a?.assignmentId === selectedAssignmentId)?.title ||
        null,
    };
  }, [
    assignmentOptions,
    assignmentTitle,
    selectedAssignmentId,
    selectedBatchCourseSubjectId,
    selectedBatchId,
    selectedBatchName,
    selectedCourseCode,
    selectedCourseDisplay,
    subjectCode,
    subjectName,
    subjectOptions,
  ]);

  const submissionsSorted = useMemo(() => {
    const list = Array.isArray(submissions) ? submissions : [];
    return list.slice().sort((a, b) => {
      const pa = (a?.studentPrn || "").toString();
      const pb = (b?.studentPrn || "").toString();
      return pa.localeCompare(pb, undefined, { numeric: true, sensitivity: "base" });
    });
  }, [submissions]);

  const isSubmitted = (s) => {
    const status = (s?.status || "").toString().toUpperCase();
    return status === "SUBMITTED" || status === "EVALUATED";
  };

  const isEvaluatable = (s) => {
    const status = (s?.status || "").toString().toUpperCase();
    return status === "SUBMITTED" || status === "EVALUATED";
  };

  const getDraft = (submissionId) => {
    return submissionId ? submissionDrafts[submissionId] : null;
  };

  const updateDraft = (submissionId, patch) => {
    if (!submissionId) return;
    setSubmissionDrafts((prev) => ({
      ...prev,
      [submissionId]: {
        ...(prev[submissionId] || {}),
        ...patch,
      },
    }));
  };

  const toGradeNumberOrNull = (v) => {
    if (v == null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const saveEvaluationIfChanged = async ({ submissionId, currentGrade, currentRemarks }) => {
    if (!submissionId) return;
    if (savingSubmissionIds.has(submissionId)) return;

    const draft = getDraft(submissionId);
    if (!draft) return;
    const nextGrade = toGradeNumberOrNull(draft?.grade);
    const nextRemarks = (draft?.remarks ?? "").toString();

    const normalizedCurrentGrade = toGradeNumberOrNull(currentGrade);
    const normalizedCurrentRemarks = (currentRemarks ?? "").toString();

    if (nextGrade === normalizedCurrentGrade && nextRemarks === normalizedCurrentRemarks) return;

    try {
      setSavingSubmissionIds((prev) => {
        const next = new Set(prev);
        next.add(submissionId);
        return next;
      });

      await assignmentService.evaluateSubmission(submissionId, {
        grade: nextGrade,
        remarks: nextRemarks,
      });

      setSubmissions((prev) =>
        (Array.isArray(prev) ? prev : []).map((s) =>
          s?.submissionId === submissionId
            ? {
                ...s,
                grade: nextGrade,
                remarks: nextRemarks,
                status: "EVALUATED",
              }
            : s
        )
      );

      toast.success("Updated");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update");
      updateDraft(submissionId, {
        grade: currentGrade ?? "",
        remarks: currentRemarks ?? "",
      });
    } finally {
      setSavingSubmissionIds((prev) => {
        const next = new Set(prev);
        next.delete(submissionId);
        return next;
      });
    }
  };

  const submittedCount = useMemo(() => {
    return submissionsSorted.reduce((acc, s) => acc + (isSubmitted(s) ? 1 : 0), 0);
  }, [submissionsSorted]);

  const totalStudents = useMemo(() => {
    if (analytics?.totalStudents != null) return analytics.totalStudents;
    return submissionsSorted.length;
  }, [analytics, submissionsSorted.length]);

  const formatPrnSuffix = (prn) => {
    const text = (prn || "").toString();
    const m = text.match(/(\d+)$/);
    if (!m) return "";
    const digits = m[1];
    const last3 = digits.slice(-3);
    const n = parseInt(last3, 10);
    if (Number.isNaN(n)) return last3;
    return String(n);
  };

  const triggerBrowserDownload = async ({ url, filename }) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to download file");
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  };

  const handleBatchDownload = async () => {
    if (!selectedAssignmentId) return;

    try {
      setDownloadLoading(true);
      toast.info("Preparing download...");

      const submitted = submissionsSorted.filter((s) => Boolean(s?.fileUrl));
      if (submitted.length === 0) {
        toast.info("No submissions found for this assignment.");
        return;
      }

      const zip = new JSZip();
      const folder = zip.folder(`assignment_${selectedAssignmentId}`);

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
      a.download = `${selectedStateForTabs.subjectCode || "subject"}_${selectedAssignmentId}_submissions.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);

      toast.success("Download started.");
    } catch (e) {
      toast.error(e?.message || "Failed to download submissions");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDownloadSubmission = async (s) => {
    if (!isSubmitted(s)) return;
    if (!s?.submissionId) return;

    try {
      const { downloadUrl } = (await assignmentService.getSubmissionDownloadUrl(s.submissionId)) || {};
      const url = downloadUrl || s?.fileUrl;
      if (!url) {
        toast.error("Submission file not available.");
        return;
      }

      const safeName = (s?.fileName || `submission_${s.submissionId}`).toString().replace(/[/\\]/g, "_");
      await triggerBrowserDownload({ url, filename: safeName });
    } catch {
      toast.error("Failed to download submission.");
    }
  };

  const handleGridDownload = (s) => {
    if (!isSubmitted(s)) return;
    handleDownloadSubmission(s);
  };

  const handleGoAssignmentsWithSelection = () => {
    navigate("/faculty/assignments", { state: selectedStateForTabs });
  };

  if (authLoading) {
    return (
      <div className="container-fluid">
        <div className="text-center">
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  if (!user?.userId) {
    return (
      <div className="container-fluid">
        <div className="alert alert-warning">
          Please login again to view Analytics.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <CourseBreadcrumb
        batchId={selectedBatchId}
        batchName={selectedBatchName}
        courseName={selectedCourseDisplay}
        subjectName={selectedSubjectDisplay}
        assignmentTitle={selectedStateForTabs.assignmentTitle}
        state={selectedStateForTabs}
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
            state={selectedStateForTabs}
            className={({ isActive }) =>
              `btn btn-sm flex-fill ${isActive ? "btn-light" : "btn-outline-light"}`
            }
            style={{ borderRadius: 8, fontWeight: 600, color: "#111827" }}
            end
            onClick={(e) => {
              e.preventDefault();
              handleGoAssignmentsWithSelection();
            }}
          >
            Assignments
          </NavLink>
          <NavLink
            to="/faculty/analytics"
            state={selectedStateForTabs}
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
          disabled={!selectedAssignmentId || downloadLoading}
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
                value={selectedBatchName}
                onChange={(e) => {
                  setSelectedBatchName(e.target.value);
                  setSelectedCourseCode("");
                  setSelectedBatchCourseSubjectId(null);
                  setSelectedAssignmentId(null);
                }}
                disabled={loadingMeta}
              >
                <option value="">Select Batch</option>
                {Array.from(
                  new Set(
                    (Array.isArray(facultyAssignments) ? facultyAssignments : [])
                      .map((a) => a?.batchName)
                      .filter(Boolean)
                  )
                ).map((bn) => (
                  <option key={bn} value={bn}>
                    {bn}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: 220 }}>
              <select
                className="form-select"
                value={selectedCourseCode}
                onChange={(e) => {
                  setSelectedCourseCode(e.target.value);
                  setSelectedBatchCourseSubjectId(null);
                  setSelectedAssignmentId(null);
                }}
                disabled={!selectedBatchName}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.courseCode} value={c.courseCode}>
                    {c.courseCode}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: 220 }}>
              <select
                className="form-select"
                value={selectedBatchCourseSubjectId ?? ""}
                onChange={(e) => {
                  const v = e.target.value ? Number(e.target.value) : null;
                  setSelectedBatchCourseSubjectId(Number.isNaN(v) ? null : v);
                  setSelectedAssignmentId(null);
                }}
                disabled={!selectedCourseCode}
              >
                <option value="">Select Subject</option>
                {subjectOptions.map((s) => (
                  <option key={s.batchCourseSubjectId} value={s.batchCourseSubjectId}>
                    {s.subjectName || s.subjectCode}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ minWidth: 240 }}>
              <select
                className="form-select"
                value={selectedAssignmentId ?? ""}
                onChange={(e) => {
                  const v = e.target.value ? Number(e.target.value) : null;
                  setSelectedAssignmentId(Number.isNaN(v) ? null : v);
                }}
                disabled={!selectedBatchCourseSubjectId || loadingAssignments}
              >
                <option value="">Select Assignment</option>
                {assignmentOptions.map((a) => (
                  <option key={a.assignmentId} value={a.assignmentId}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? <div className="alert alert-danger py-2 mb-3">{error}</div> : null}

          {!selectedBatchName || !selectedCourseCode || !selectedBatchCourseSubjectId ? (
            <div className="alert alert-warning py-2 mb-3">
              Please select a batch, course and a subject to view analytics.
            </div>
          ) : null}

          {!selectedAssignmentId ? null : (
            <>
              {loadingSubmissions ? (
                <div className="text-muted mb-3">Loading analytics...</div>
              ) : null}

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
                    {submissionsSorted.map((s) => {
                      const submitted = isSubmitted(s);
                      const bg = submitted ? "rgba(70, 223, 126, 0.36)" : "#ffffff";
                      const border = submitted ? "rgba(34, 197, 94, 0.8)" : "#e5e7eb";
                      const label = formatPrnSuffix(s?.studentPrn);
                      return (
                        <button
                          key={s.submissionId || s.studentUserId}
                          type="button"
                          onClick={() => handleGridDownload(s)}
                          disabled={!submitted}
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
                            cursor: submitted ? "pointer" : "not-allowed",
                          }}
                          aria-label={`Student ${s?.studentPrn || ""}`}
                        >
                          {label}
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
                          Submitted: {submittedCount}/{totalStudents}
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
                        {submissionsSorted.map((s) => {
                          const submitted = isSubmitted(s);
                          const rowStyle = submitted ? undefined : { opacity: 0.5 };

                          const submissionId = s?.submissionId;
                          const draft = submissionId ? submissionDrafts[submissionId] : null;
                          const gradeValue = draft?.grade ?? (s?.grade ?? "");
                          const remarksValue = draft?.remarks ?? (s?.remarks ?? "");
                          const isSaving = submissionId ? savingSubmissionIds.has(submissionId) : false;
                          const evaluatable = isEvaluatable(s);

                          return (
                            <tr key={s.submissionId || s.studentUserId} style={rowStyle}>
                              <td className="text-muted">{s.studentPrn || "-"}</td>
                              <td>{s.studentName || "-"}</td>
                              <td>
                                {evaluatable ? (
                                  <select
                                    className="form-select form-select-sm"
                                    value={gradeValue}
                                    disabled={isSaving}
                                    onChange={(e) => {
                                      updateDraft(submissionId, { grade: e.target.value });
                                    }}
                                    onBlur={() => {
                                      saveEvaluationIfChanged({
                                        submissionId,
                                        currentGrade: s?.grade,
                                        currentRemarks: s?.remarks,
                                      });
                                    }}
                                  >
                                    <option value="">-</option>
                                    {Array.from({ length: 10 }).map((_, i) => {
                                      const n = i + 1;
                                      return (
                                        <option key={n} value={String(n)}>
                                          {n}
                                        </option>
                                      );
                                    })}
                                  </select>
                                ) : submitted ? (
                                  <span className="text-muted">{s.grade ?? "-"}</span>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td>
                                {evaluatable ? (
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={remarksValue}
                                    disabled={isSaving}
                                    onChange={(e) => {
                                      updateDraft(submissionId, { remarks: e.target.value });
                                    }}
                                    onBlur={() => {
                                      saveEvaluationIfChanged({
                                        submissionId,
                                        currentGrade: s?.grade,
                                        currentRemarks: s?.remarks,
                                      });
                                    }}
                                  />
                                ) : submitted ? (
                                  <span className="text-muted">{s.remarks ?? "-"}</span>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() => handleDownloadSubmission(s)}
                                  disabled={!submitted}
                                >
                                  Download
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
