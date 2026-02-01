import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";

import CourseBreadcrumb from "../../components/faculty/CourseBreadcrumb";
import assignmentService from "../../services/api/assignmentService";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const AddAssignmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const {
    mode = "create",
    assignmentId = null,
    batchId = null,
    batchName = null,
    courseCode = null,
    courseName = null,
    subjects = [],
    batchCourseSubjectId = null,
    subjectCode = null,
    subjectName = null,
  } = location.state || {};

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [existingFileUrl, setExistingFileUrl] = useState(null);
  const [existingFileName, setExistingFileName] = useState(null);

  const pageTitle = useMemo(() => {
    const prefix = subjectName || "Assignment";
    return mode === "edit" ? `${prefix} : Edit Assignment` : `${prefix} : Add New Assignment`;
  }, [mode, subjectName]);

  useEffect(() => {
    if (mode !== "edit") return;
    if (!assignmentId) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const a = await assignmentService.getAssignmentById(assignmentId);
        if (!mounted) return;

        setTitle(a?.title || "");
        setDescription(a?.description || "");
        setExistingFileUrl(a?.fileUrl || null);
        setExistingFileName(a?.fileName || null);

        if (typeof a?.dueDate === "string" && a.dueDate.length >= 10) {
          setDueDate(a.dueDate.slice(0, 10));
        }
      } catch {
        if (!mounted) return;
        toast.error("Failed to load assignment details.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [assignmentId, mode]);

  const validate = () => {
    const nextErrors = {};

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 2 || trimmedTitle.length > 100) {
      nextErrors.title = "Title must be 2-100 characters";
    }

    if (!dueDate) {
      nextErrors.dueDate = "Due date is required";
    }

    if (!batchCourseSubjectId) {
      nextErrors.batchCourseSubjectId = "Missing subject context";
    }

    const invalidFiles = files.filter((f) => f.size > MAX_FILE_SIZE_BYTES);
    if (invalidFiles.length > 0) {
      nextErrors.files = "Each file must be less than 10MB";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (incoming.length === 0) return;

    setFiles((prev) => {
      const existing = new Map(prev.map((f) => [`${f.name}-${f.size}-${f.lastModified}`, f]));
      incoming.forEach((f) => {
        existing.set(`${f.name}-${f.size}-${f.lastModified}`, f);
      });
      return Array.from(existing.values());
    });

    setErrors((prev) => {
      if (!prev.files) return prev;
      const next = { ...prev };
      delete next.files;
      return next;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (key) => {
    setFiles((prev) => prev.filter((f) => `${f.name}-${f.size}-${f.lastModified}` !== key));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors and try again.");
      return;
    }

    (async () => {
      try {
        setLoading(true);

        const dueLocalDateTime = `${dueDate}T23:59:59`;

        const payload = {
          batchCourseSubjectId,
          title: title.trim(),
          description: description.trim(),
          dueDate: dueLocalDateTime,
        };

        const formData = new FormData();
        formData.append("assignment", JSON.stringify(payload));

        const firstFile = files?.[0] || null;
        if (firstFile) {
          formData.append("file", firstFile);
        }

        if (mode === "edit") {
          await assignmentService.updateAssignment(assignmentId, formData);
          toast.success("Assignment updated successfully.");
        } else {
          await assignmentService.createAssignment(formData);
          toast.success("Assignment created successfully.");
        }

        navigate("/faculty/assignments", {
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
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to save assignment");
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="container-fluid">
      <CourseBreadcrumb
        batchId={batchId}
        batchName={batchName}
        courseName={courseName || courseCode}
        subjectName={subjectName}
        state={location.state}
      />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-semibold mb-4">{pageTitle}</h5>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Assignment Title</label>
              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                minLength={2}
                maxLength={100}
                required
              />
              {errors.title ? <div className="invalid-feedback">{errors.title}</div> : null}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Due Date</label>
              <input
                type="date"
                className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
              {errors.dueDate ? <div className="invalid-feedback">{errors.dueDate}</div> : null}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{ resize: "none", overflow: "hidden" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Attachments</label>

              {mode === "edit" && existingFileUrl ? (
                <div className="mb-2 small">
                  <span className="text-muted">Current file: </span>
                  <a href={existingFileUrl} target="_blank" rel="noreferrer">
                    {existingFileName || "View"}
                  </a>
                </div>
              ) : null}

              <div
                role="button"
                tabIndex={0}
                onClick={handleBrowse}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                style={{
                  border: "1px dashed #d1d5db",
                  background: "#ffffff",
                  borderRadius: 12,
                  padding: 20,
                  minHeight: 86,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <Upload size={18} color="#6b7280" />
                <div className="text-muted small">Drag and drop files here, or click to upload.</div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={(e) => addFiles(e.target.files)}
              />

              {errors.files ? <div className="text-danger small mt-2">{errors.files}</div> : null}

              {files.length > 0 ? (
                <div className="mt-3">
                  {files.map((f) => {
                    const key = `${f.name}-${f.size}-${f.lastModified}`;
                    return (
                      <div
                        key={key}
                        className="d-flex align-items-center justify-content-between border rounded px-3 py-2 mb-2"
                      >
                        <div className="small">
                          <div className="fw-semibold">{f.name}</div>
                          <div className="text-muted">{Math.ceil(f.size / 1024)} KB</div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveFile(key)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: "#5B5CE6", borderColor: "#5B5CE6" }}
                disabled={loading}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAssignmentPage;
