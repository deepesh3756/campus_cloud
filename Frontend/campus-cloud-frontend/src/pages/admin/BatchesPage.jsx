import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import academicService from "../../services/api/academicService";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import { toast } from "react-toastify";

const BatchesPage = () => {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchBatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await academicService.getBatches();
        if (isMounted) {
          const batchList = Array.isArray(data) ? data : [];
          // Sort by startDate descending (newest first)
          batchList.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
          setBatches(batchList);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load batches");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBatches();
    return () => {
      isMounted = false;
    };
  }, []);

  const breadcrumbItems = [{ label: "Batches" }];

  const getStatusBadgeClass = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "ACTIVE") return "badge rounded-pill text-bg-primary";
    if (s === "COMPLETED") return "badge rounded-pill text-bg-light border text-secondary";
    return "badge rounded-pill text-bg-light border text-secondary";
  };

  const getApiErrorMessage = (err, fallback) => {
    const apiMessage = err?.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage;
    const message = err?.message;
    if (typeof message === "string" && message.trim()) return message;
    return fallback;
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.batchId) return;
    setDeleting(true);
    try {
      await academicService.deleteBatch(deleteTarget.batchId);
      setBatches((prev) => prev.filter((b) => b.batchId !== deleteTarget.batchId));
      toast.success("Batch deleted successfully", { autoClose: 2500 });
      setDeleteTarget(null);
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to delete batch");
      toast.error(message, { autoClose: 3500 });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="batches-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Batch"
        message={deleteTarget ? `Are you sure you want to delete ${deleteTarget.batchName}?` : "Are you sure you want to delete?"}
        loading={deleting}
        onCancel={() => (deleting ? null : setDeleteTarget(null))}
        onConfirm={handleConfirmDelete}
      />

      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
        <h4 className="fw-bold mb-0">Batch List</h4>
        <button
          type="button"
          className="btn btn-primary d-inline-flex align-items-center gap-2"
          onClick={() => navigate("/admin/batches/new")}
        >
          <Plus size={18} />
          Add New Batch
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 80 }}>
                    S.no
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Batch Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Start Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    End Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Total Students
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Courses
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 140 }}>
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 120 }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={8}>
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-danger" colSpan={8}>
                      {error}
                    </td>
                  </tr>
                ) : batches.length ? (
                  batches.map((batch, idx) => (
                    <tr key={batch.batchId}>
                    <td className="px-4 py-3 text-secondary text-center">{idx + 1}</td>

                    <td className="px-4 py-3 text-center">
                      <NavLink
                        to={`/admin/batches/${batch.batchId}`}
                        className="text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/admin/batches/${batch.batchId}`);
                        }}
                        style={{ color: "#4f46e5", fontWeight: 600 }}
                      >
                        {batch.batchName}
                      </NavLink>
                    </td>

                    <td className="px-4 py-3 text-secondary text-center" style={{ whiteSpace: "nowrap" }}>
                      {batch.startDate}
                    </td>

                    <td className="px-4 py-3 text-secondary" style={{ whiteSpace: "nowrap" }}>
                      {batch.endDate}
                    </td>

                    <td className="px-4 py-3 text-secondary text-center">-</td>

                    <td className="px-4 py-3 text-secondary text-center" style={{ minWidth: 260 }}>
                      {typeof batch.totalCourses === "number" ? batch.totalCourses : "-"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={getStatusBadgeClass(batch.status)}>{batch.status}</span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="d-inline-flex align-items-center gap-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-secondary"
                          onClick={() => navigate(`/admin/batches/${batch.batchId}/edit`)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-danger"
                          onClick={() => setDeleteTarget(batch)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={8}>
                      No batches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchesPage;
