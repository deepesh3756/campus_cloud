import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipboardList, Pencil, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const CourseDetailsPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const courses = useMemo(
    () => [
      {
        id: "pg-dac-aug-2025",
        code: "PG-DAC",
        name: "PG-DAC",
        startDate: "2025-08-01",
        endDate: "2026-02-01",
        totalStudents: 240,
        subjects: [
          "C++",
          "Data Structures and Algorithms",
          "Web based Java programming",
          "Databases",
          "COSDM",
          "Microsoft .Net",
        ],
        status: "Active",
        batchId: "aug-2025",
        batchName: "August-2025",
      },
      {
        id: "pg-dbda-aug-2025",
        code: "PG-DBDA",
        name: "PG-DBDA",
        startDate: "2025-08-01",
        endDate: "2026-02-01",
        totalStudents: 58,
        subjects: ["Data Science", "MySql", "Oracle", "Hadoop"],
        status: "Active",
        batchId: "aug-2025",
        batchName: "August-2025",
      },
    ],
    []
  );

  const course = courses.find((c) => c.id === courseId) || null;

  const breadcrumbItems = useMemo(() => {
    const title = course?.code || "Course";
    return [{ label: "Courses", to: "/admin/courses" }, { label: title }];
  }, [course?.code]);

  const getStatusBadgeClass = (status) => {
    if (status === "Active") return "badge rounded-pill text-bg-primary";
    return "badge rounded-pill text-bg-light border text-secondary";
  };

  const handleDelete = () => {
    const ok = window.confirm(
      "Are you sure you want to delete this course? This will remove related data like subjects, students and assignments."
    );
    if (!ok) return;

    navigate("/admin/courses");
  };

  if (!course) {
    return (
      <div className="course-details-page">
        <AdminBreadcrumb items={[{ label: "Courses", to: "/admin/courses" }, { label: "Course" }]} />
        <div className="text-secondary">Course not found.</div>
      </div>
    );
  }

  return (
    <div className="course-details-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
            <div>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <h3 className="fw-bold mb-0">{course.code}</h3>
                <span className={getStatusBadgeClass(course.status)}>{course.status}</span>
              </div>

              <div className="row g-3 mt-3">
                <div className="col-12 col-md-4">
                  <div className="text-secondary" style={{ fontSize: 13 }}>
                    Start Date
                  </div>
                  <div className="fw-semibold">{course.startDate}</div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="text-secondary" style={{ fontSize: 13 }}>
                    End Date
                  </div>
                  <div className="fw-semibold">{course.endDate}</div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="text-secondary" style={{ fontSize: 13 }}>
                    Total Students
                  </div>
                  <div className="fw-semibold">{course.totalStudents}</div>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-light border d-inline-flex align-items-center gap-2"
                onClick={() => navigate(`/admin/courses/${courseId}/edit`)}
              >
                <Pencil size={16} />
                Edit Course
              </button>
              <button
                type="button"
                className="btn btn-danger d-inline-flex align-items-center gap-2"
                onClick={handleDelete}
              >
                <Trash2 size={16} />
                Delete Course
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="fw-bold mb-3">Subjects in {course.code}</h5>
            <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
              <div className="card-body p-0">
                {course.subjects.map((s) => (
                  <div
                    key={s}
                    className="d-flex align-items-center gap-2 px-4 py-3 border-bottom"
                    style={{ fontSize: 14 }}
                  >
                    <ClipboardList size={16} className="text-secondary" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
