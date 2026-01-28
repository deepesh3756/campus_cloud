import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const SubjectsPage = () => {
  const location = useLocation();

  const subjects = useMemo(
    () => [
      {
        key: "cpp",
        name: "C++",
        assignments: Array.from({ length: 6 }).map((_, idx) => ({
          number: idx + 1,
          completed: idx < 2,
        })),
      },
      {
        key: "dbms",
        name: "Database Technologies",
        assignments: Array.from({ length: 8 }).map((_, idx) => ({
          number: idx + 1,
          completed: idx < 3,
        })),
      },
      {
        key: "java",
        name: "OOP with Java",
        assignments: Array.from({ length: 5 }).map((_, idx) => ({
          number: idx + 1,
          completed: idx < 1,
        })),
      },
      {
        key: "dsa",
        name: "Algorithms & Data Structures",
        assignments: Array.from({ length: 10 }).map((_, idx) => ({
          number: idx + 1,
          completed: idx === 1 || idx === 2,
        })),
      },
      {
        key: "web",
        name: "Web Programming Technologies",
        assignments: Array.from({ length: 4 }).map((_, idx) => ({
          number: idx + 1,
          completed: idx < 2,
        })),
      },
      {
        key: "dotnet",
        name: "Microsoft .NET Technologies",
        assignments: Array.from({ length: 13 }).map((_, idx) => ({
          number: idx + 1,
          completed: idx === 1 || idx >= 5,
        })),
      },
    ],
    []
  );

  const highlightedKey = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get("subject");
  }, [location.search]);

  const MAX_VISIBLE_PILLS = 12;

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <h2 className="fw-semibold">Subjects</h2>
      </div>

      <div className="card shadow-sm border rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle table-hover  mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 90 }}>S.No</th>
                  <th>Subject Name</th>
                  <th style={{ width: 360 }}>Assignments</th>
                </tr>
              </thead>

              <tbody>
                {subjects.map((s, idx) => {
                  const visible = s.assignments.slice(0, MAX_VISIBLE_PILLS);
                  const hiddenCount = Math.max(0, s.assignments.length - visible.length);
                  const isHighlighted = highlightedKey && highlightedKey === s.key;

                  return (
                    <tr key={s.key} style={isHighlighted ? { backgroundColor: "#eef2ff" } : undefined}>
                      <td className="text-muted">{idx + 1}</td>

                      <td className="fw-medium">
                        <Link
                          to={`/student/subjects/${encodeURIComponent(s.key)}`}
                          className="text-decoration-none"
                        >
                          {s.name}
                        </Link>
                      </td>

                      <td>
                        <div
                          className="d-flex flex-wrap gap-2"
                          style={{ maxHeight: 84, overflow: "hidden" }}
                          title={
                            hiddenCount
                              ? s.assignments.map((a) => String(a.number)).join(", ")
                              : undefined
                          }
                        >
                          {visible.map((a) => (
                            <span
                              key={`${s.key}-${a.number}`}
                              className={
                                a.completed
                                  ? "badge rounded-pill bg-primary text-white shadow-sm"
                                  : "badge rounded-pill bg-light text-secondary border"
                              }
                              style={{ minWidth: 28, textAlign: "center" }}
                            >
                              {a.number}
                            </span>
                          ))}

                          {hiddenCount ? (
                            <span
                              className="badge rounded-pill bg-light text-secondary border"
                              style={{ minWidth: 36, textAlign: "center" }}
                              title={s.assignments.map((a) => String(a.number)).join(", ")}
                            >
                              +{hiddenCount}
                            </span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectsPage;
