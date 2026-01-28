import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UploadModal from "../../components/common/UploadModal";
import StudentBreadcrumb from "../../components/common/StudentBreadcrumb";

const SUBJECT_LABELS = {
  cpp: "C++",
  dbms: "Database Technologies",
  java: "OOP with Java",
  dsa: "Algorithms & Data Structures",
  web: "Web Programming Technologies",
  dotnet: "Microsoft .NET Technologies",
};

const AssignmentsPage = () => {
  const navigate = useNavigate();
  const { subjectKey } = useParams();

  const subjectTitle = useMemo(() => {
    if (!subjectKey) return "My Assignments";
    return `${SUBJECT_LABELS[subjectKey] ?? subjectKey} Assignments`;
  }, [subjectKey]);

  const [loading] = useState(false);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState(null);

  const assignments = useMemo(
    () =>
      // TODO: replace with API call filtered by subjectKey
      [
        {
          id: "1",
          name: "C++ Basics: Variables & Data Types",
          createdDate: "2024-03-01",
          dueDate: "2024-03-10",
          status: "Submitted",
          grade: "",
          remarks: "NA",
        },
        {
          id: "2",
          name: "Control Structures Practice",
          createdDate: "2024-03-05",
          dueDate: "2024-03-14",
          status: "Pending",
          grade: "",
          remarks: "NA",
        },
        {
          id: "3",
          name: "Functions & Recursion",
          createdDate: "2024-03-10",
          dueDate: "2024-03-20",
          status: "Evaluated",
          grade: "9/10",
          remarks: "Good work",
        },
        {
          id: "4",
          name: "Object-Oriented Concepts in C++",
          createdDate: "2024-03-15",
          dueDate: "2024-03-25",
          status: "Pending",
          grade: "",
          remarks: "NA",
        },
      ],
    []
  );

  const openUpload = (assignment) => {
    setActiveAssignment(assignment);
    setIsUploadOpen(true);
  };

  const closeUpload = () => {
    setIsUploadOpen(false);
    setActiveAssignment(null);
  };

  const statusBadgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "submitted")
      return "badge bg-success-subtle text-success border";
    if (s === "evaluated")
      return "badge bg-primary-subtle text-primary border";
    return "badge bg-warning-subtle text-warning border";
  };

  const handleRowOpen = (assignmentId) => {
    navigate(`/student/assignments/${assignmentId}`, { state: { subjectKey } });
  };

  if (loading) return <div className="py-4">Loading...</div>;

  return (
    <div className="assignments-hero container-fluid">
      <div className="mb-3">
        {subjectKey ? (
          <StudentBreadcrumb
            items={[
              {
                label: SUBJECT_LABELS[subjectKey] ?? subjectKey,
                to: `/student/subjects?subject=${encodeURIComponent(subjectKey)}`,
              },
            ]}
          />
        ) : null}
        <h2 className="fw-semibold">{subjectTitle}</h2>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle assignments-table">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 70 }}>S.No</th>
                  <th>Assignment Name</th>
                  <th style={{ width: 140 }}>Created Date</th>
                  <th style={{ width: 120 }}>Due Date</th>
                  <th style={{ width: 130 }}>Status</th>
                  <th style={{ width: 120 }}>Grade</th>
                  <th style={{ width: 200 }}>Remarks</th>
                  <th style={{ width: 140 }} className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {assignments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center text-muted py-4"
                    >
                      No assignments found
                    </td>
                  </tr>
                ) : (
                  assignments.map((a, idx) => (
                    <tr key={a.id}>
                      <td
                        className="text-muted assignment-click"
                        onClick={() => handleRowOpen(a.id)}
                        role="button"
                      >
                        {idx + 1}
                      </td>

                      <td
                        className="assignment-click fw-medium"
                        onClick={() => handleRowOpen(a.id)}
                        role="button"
                      >
                        {a.name}
                      </td>

                      <td className="text-muted">{a.createdDate}</td>
                      <td className="text-muted">{a.dueDate}</td>

                      <td>
                        <span className={statusBadgeClass(a.status)}>
                          {a.status}
                        </span>
                      </td>

                      <td className="text-muted">
                        {a.grade || ""}
                      </td>

                      <td className="text-muted">
                        {a.remarks || "NA"}
                      </td>

                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => handleRowOpen(a.id)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="btn btn-primary ms-2"
                          onClick={() => openUpload(a)}
                          disabled={
                            a.status === "Submitted" ||
                            a.status === "Evaluated"
                          }
                        >
                          <i className="bi bi-upload"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🔽 ONLY THIS PART WAS EXTRACTED */}
      <UploadModal
        isOpen={isUploadOpen}
        title={
          activeAssignment
            ? `Upload: ${activeAssignment.name}`
            : "Upload"
        }
        onClose={closeUpload}
        onSubmit={(file) => {
          console.log(
            "Uploading for assignment:",
            activeAssignment?.id,
            file
          );
          closeUpload();
        }}
      />
    </div>
  );
};

export default AssignmentsPage;
