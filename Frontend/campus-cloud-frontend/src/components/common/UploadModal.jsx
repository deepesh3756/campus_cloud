import { useState } from "react";
import Modal from "./Modal";
import { CloudUpload } from "lucide-react";

const UploadModal = ({
  isOpen,
  onClose,
  title = "Upload File",
  onSubmit,
  accept = ".pdf,.doc,.docx,.zip",
  maxSizeText = "Maximum size: 25MB",
}) => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files?.[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    onSubmit(file);
    setFile(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        {/* Upload box */}
        <label
          htmlFor="upload-input"
          className="border border-2 border-dashed rounded-3 p-4 w-100 text-center mb-3"
          style={{
            cursor: "pointer",
            backgroundColor: "#fafafa",
          }}
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

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!file}
          >
            Upload
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadModal;
