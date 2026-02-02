import Modal from "./Modal";

const ConfirmDeleteModal = ({
  isOpen,
  title = "Confirm Delete",
  message = "Are you sure you want to delete?",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={loading ? () => {} : onCancel} title={title}>
      <div className="d-flex flex-column gap-3">
        <div className="text-secondary">{message}</div>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-light border" onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
