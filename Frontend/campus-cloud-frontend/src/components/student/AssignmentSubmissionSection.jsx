import { useRef } from "react";
import { CloudUpload } from "lucide-react";

import { useFileUpload } from "../../hooks/useFileUpload";

const ACCEPT = ".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg,.gif";

const AssignmentSubmissionSection = ({
  disabled = false,
  onSubmit,
  onCancel,
  accept = ACCEPT,
  maxSizeText = "Maximum size: 25MB",
}) => {
  const inputRef = useRef(null);

  const { file, error, uploading, handleFileChange, reset } = useFileUpload({
    maxSize: 25 * 1024 * 1024,
    allowedTypes: accept.split(",").map((s) => s.trim()),
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
      "application/x-zip-compressed",
      "image/png",
      "image/jpeg",
      "image/gif",
    ],
  });

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    const droppedFile = e.dataTransfer?.files?.[0];
    if (!droppedFile) return;
    handleFileChange({ target: { files: [droppedFile] } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled || !file) return;
    if (onSubmit) onSubmit(file);
    reset();
  };

  const handleCancel = () => {
    reset();
    if (onCancel) onCancel();
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <h5 className="fw-semibold mb-3">Upload Assignment</h5>

        <div
          className={`rounded-3 p-4 text-center ${disabled ? "opacity-50" : ""}`}
          style={{
            border: "2px dashed #cbd5e1",
            backgroundColor: "#fafafa",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          role="button"
          tabIndex={0}
          onClick={() => {
            if (disabled) return;
            inputRef.current?.click();
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
        >
          <CloudUpload size={40} className="mb-2 text-secondary" />
          <div className="fw-semibold">Drag files here or click to browse</div>
          <div className="text-muted small mt-1">Supported formats: PDF, DOC/DOCX, ZIP, Images</div>
          <div className="text-muted small">{maxSizeText}</div>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            hidden
            onChange={handleFileChange}
            disabled={disabled}
          />
        </div>

        {file ? (
          <div className="alert alert-light border py-2 mt-3 mb-0">
            <strong>Selected:</strong> {file.name}
          </div>
        ) : null}

        {error ? <div className="text-danger mt-2">{error}</div> : null}

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleCancel}
            disabled={uploading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={disabled || uploading || !file}
          >
            {uploading ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissionSection;
