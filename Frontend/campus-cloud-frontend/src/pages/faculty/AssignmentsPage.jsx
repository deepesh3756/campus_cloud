import { useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Download, Pencil, Trash2, Plus } from "lucide-react";

import CourseBreadcrumb from "../../components/faculty/CourseBreadcrumb";

const AssignmentsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    courseId = null,
    courseName = "PG-DAC",
    subjectId = null,
    subjectName = null,
  } = location.state || {};

  const assignments = useMemo(
    () => [
      {
        id: "a1",
        title: "Introduction to C++",
        dueDate: "2023-10-26",
        progress: 75,
      },
      {
        id: "a2",
        title: "Operating System Concepts",
        dueDate: "2023-11-01",
        progress: 50,
      },
      {
        id: "a3",
        title: "Java Fundamentals",
        dueDate: "2023-11-10",
        progress: 90,
      },
      {
        id: "a4",
        title: "Inheritance in Java",
        dueDate: "2023-11-10",
        progress: 90,
      },
      {
        id: "a5",
        title: "Overriding in Java",
        dueDate: "2023-11-10",
        progress: 90,
      },
    ],
    []
  );

  const handleAddAssignment = () => {
    navigate("/faculty/add-assignment", {
      state: {
        courseId,
        courseName,
        subjectId,
        subjectName,
      },
    });
  };

  const handleOpenAnalytics = (assignment) => {
    navigate("/faculty/analytics", {
      state: {
        courseId,
        courseName,
        subjectId,
        subjectName,
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
      },
    });
  };

  const handleBatchDownload = (assignment) => {
    console.log("Batch download", { assignmentId: assignment.id });
  };

  const handleEdit = (assignment) => {
    console.log("Edit assignment", { assignmentId: assignment.id });
  };

  const handleDelete = (assignment) => {
    console.log("Delete assignment", { assignmentId: assignment.id });
  };

  return (
    <div className="container-fluid">
      <CourseBreadcrumb courseName={courseName} subjectName={subjectName} />

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
            state={location.state}
            className={({ isActive }) =>
              `btn btn-sm flex-fill ${isActive ? "btn-light" : "btn-outline-light"}`
            }
            style={{
              borderRadius: 8,
              fontWeight: 600,
              color: "#111827",
            }}
            end
          >
            Assignments
          </NavLink>
          <NavLink
            to="/faculty/analytics"
            state={location.state}
            className={({ isActive }) =>
              `btn btn-sm flex-fill ${isActive ? "btn-light" : "btn-outline-light"}`
            }
            style={{
              borderRadius: 8,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            Analytics
          </NavLink>
        </div>

        <button
          type="button"
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleAddAssignment}
          style={{ backgroundColor: "#5B5CE6", borderColor: "#5B5CE6" }}
        >
          <Plus size={16} />
          Add Assignment
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="p-4 pb-0">
            <h5 className="fw-semibold mb-3">Assignments</h5>
          </div>

          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 80 }}>S.no</th>
                  <th>Title</th>
                  <th style={{ width: 140 }}>Due Date</th>
                  <th style={{ width: 220 }}>Progress</th>
                  <th style={{ width: 150 }} className="text-center">
                    Batch Download
                  </th>
                  <th style={{ width: 140 }} className="text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a, idx) => (
                  <tr key={a.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        style={{ color: "#111827", textDecoration: "underline" }}
                        onClick={() => handleOpenAnalytics(a)}
                      >
                        {a.title}
                      </button>
                    </td>
                    <td className="text-muted">{a.dueDate}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: 6 }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${a.progress}%`,
                              backgroundColor: "#5B5CE6",
                            }}
                            aria-valuenow={a.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <div className="text-muted small" style={{ minWidth: 36 }}>
                          {a.progress}%
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleBatchDownload(a)}
                        style={{ backgroundColor: "#5B5CE6", borderColor: "#5B5CE6" }}
                        aria-label="Batch download"
                      >
                        <Download size={16} />
                      </button>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-link p-0 me-3"
                        onClick={() => handleEdit(a)}
                        aria-label="Edit"
                        style={{ color: "#111827" }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={() => handleDelete(a)}
                        aria-label="Delete"
                        style={{ color: "#ef4444" }}
                      >
                        <Trash2 size={16} />
                      </button>
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

export default AssignmentsPage;
