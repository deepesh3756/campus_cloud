import {
  File,
  FileArchive,
  FileImage,
  FileText,
  Download,
} from "lucide-react";

const getAttachmentIcon = (type) => {
  const t = (type || "").toLowerCase();

  if (t.includes("pdf") || t.includes("doc")) return FileText;
  if (t.includes("zip") || t.includes("rar") || t.includes("7z")) return FileArchive;
  if (t.includes("png") || t.includes("jpg") || t.includes("jpeg") || t.includes("gif")) return FileImage;

  return File;
};

const AssignmentAttachmentsSection = ({ attachments = [], onDownload }) => {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-semibold mb-0">Attachments</h5>
        </div>

        {attachments.length === 0 ? (
          <div className="text-muted">No attachments</div>
        ) : (
          <div className="list-group">
            {attachments.map((a) => {
              const Icon = getAttachmentIcon(a.type);

              return (
                <div
                  key={a.id ?? a.name}
                  className="list-group-item d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex align-items-center gap-2">
                    <Icon size={18} className="text-secondary" />
                    <div>
                      <div className="fw-medium">{a.name}</div>
                      {a.type ? <div className="text-muted small">{a.type}</div> : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
                    onClick={() => {
                      if (onDownload) onDownload(a);
                      else if (a.url) window.open(a.url, "_blank", "noopener,noreferrer");
                    }}
                    disabled={!onDownload && !a.url}
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentAttachmentsSection;
