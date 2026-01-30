import React from "react";

const SuccessModal = ({ show, title = "Success", message = "", onClose }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show" style={{ display: "block" }} tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content" style={{ borderRadius: 14 }}>
            <div className="modal-header">
              <h5 className="modal-title fw-bold mb-0">{title}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <div>{message}</div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={onClose}>
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default SuccessModal;
