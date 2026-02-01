import { useState } from "react";
import Modal from "./Modal";
import { CloudUpload } from "lucide-react";
import { validateFile } from "../../utils/fileValidator";

const UploadModal = ({
  isOpen,
  onClose,
  title = "Upload File",
  onSubmit,
  accept = ".pdf,.doc,.docx,.zip",
  maxSizeBytes = 10 * 1024 * 1024,
  maxSizeText = "Maximum size: 10MB",
}) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const pickFile = (picked) => {
    if (!picked) {
      setFile(null);
      setError(null);
      return;
    }

    const allowedTypes = accept
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const validation = validateFile(picked, { maxSize: maxSizeBytes, allowedTypes });
    if (!validation.isValid) {
      setFile(null);
      setError(validation.error);
      return;
    }

    setError(null);
    setFile(picked);
  };

  const handleChange = (e) => {
    pickFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer?.files?.[0];
    pickFile(dropped);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || error) return;
    onSubmit(file);
    setFile(null);
    setError(null);
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <form onSubmit={handleSubmit}>
        {/* Upload box */}
        <label
          htmlFor="upload-input"
          className="border border-2 border-dashed rounded-3 p-4 w-100 text-center mb-3"
          style={{
            cursor: "pointer",
            backgroundColor: "#fafafa",
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <CloudUpload size={40} className="mb-2 text-secondary" />

          <div className="fw-semibold">
            Drag files here or click to browse
          </div>

          <div className="text-muted small mt-1">
            Supported formats: PDF, DOCX, ZIP
          </div>

          <div className="text-muted small">{maxSizeText}</div>

          <input
            id="upload-input"
            type="file"
            accept={accept}
            hidden
            onChange={handleChange}
          />
        </label>

        {/* Selected file */}
        {file && (
          <div className="alert alert-light border py-2 mb-3">
            <strong>Selected:</strong> {file.name}
          </div>
        )}

        {error ? <div className="text-danger mb-3">{error}</div> : null}

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!file || !!error}
          >
            Upload
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadModal;
