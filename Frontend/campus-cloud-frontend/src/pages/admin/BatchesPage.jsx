import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const BatchesPage = () => {
  const navigate = useNavigate();
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  const batches = useMemo(
    () => [
      {
        id: "aug-2025",
        name: "August-2025",
        startDate: "2025-08-01",
        endDate: "2026-02-01",
        totalStudents: 320,
        courses: "Data Structures, Algorithms, Web Development",
        status: "Active",
      },
      {
        id: "feb-2025",
        name: "February-2025",
        startDate: "2025-02-20",
        endDate: "2025-07-20",
        totalStudents: 305,
        courses: "Marketing, Finance, HR Management",
        status: "Completed",
      },
      {
        id: "aug-2024",
        name: "August-2024",
        startDate: "2024-08-01",
        endDate: "2025-02-01",
        totalStudents: 289,
        courses: "Circuit Analysis, Digital Electronics",
        status: "Completed",
      },
      {
        id: "feb-2024",
        name: "February-2024",
        startDate: "2024-02-20",
        endDate: "2024-07-20",
        totalStudents: 350,
        courses: "Literature, Philosophy, History",
        status: "Completed",
      },
      {
        id: "aug-2023",
        name: "August-2023",
        startDate: "2023-08-01",
        endDate: "2024-02-01",
        totalStudents: 380,
        courses: "Thermodynamics, Fluid Mechanics",
        status: "Completed",
      },
    ],
    []
  );

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || null;

  const breadcrumbItems = selectedBatch
    ? [
        { label: "Batches", to: "/admin/batches" },
        { label: selectedBatch.name },
      ]
    : [{ label: "Batches" }];

  const getStatusBadgeClass = (status) => {
    if (status === "Active") return "badge rounded-pill text-bg-primary";
    if (status === "Completed") return "badge rounded-pill text-bg-light border text-secondary";
    return "badge rounded-pill text-bg-light border text-secondary";
  };

  return (
    <div className="batches-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="d-flex align-items-start justify-content-end gap-3 mb-3">
        <button
          type="button"
          className="btn btn-primary d-inline-flex align-items-center gap-2"
          onClick={() => navigate("/admin/batches/new")}
        >
          <Plus size={18} />
          Add Batch
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
                {batches.map((batch, idx) => (
                  <tr key={batch.id}>
                    <td className="px-4 py-3 text-secondary text-center">{idx + 1}</td>

                    <td className="px-4 py-3 text-center">
                      <NavLink
                        to={`/admin/batches/${batch.id}`}
                        className="text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedBatchId(batch.id);
                          navigate(`/admin/batches/${batch.id}`);
                        }}
                        style={{ color: "#4f46e5", fontWeight: 600 }}
                      >
                        {batch.name}
                      </NavLink>
                    </td>

                    <td className="px-4 py-3 text-secondary text-center" style={{ whiteSpace: "nowrap" }}>
                      {batch.startDate}
                    </td>

                    <td className="px-4 py-3 text-secondary" style={{ whiteSpace: "nowrap" }}>
                      {batch.endDate}
                    </td>

                    <td className="px-4 py-3 text-secondary text-center">{batch.totalStudents}</td>

                    <td className="px-4 py-3 text-secondary text-center" style={{ minWidth: 260 }}>
                      {batch.courses}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={getStatusBadgeClass(batch.status)}>{batch.status}</span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="d-inline-flex align-items-center gap-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-secondary"
                          onClick={() => navigate(`/admin/batches/${batch.id}/edit`)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button type="button" className="btn btn-sm btn-link p-0 text-danger">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchesPage;
