import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { useFacultyData } from "../../context/FacultyContext";
import FacultySubjectProgressCard from "../../components/faculty/FacultySubjectProgressCard";

const buildMockAssignments = (subject) => {
  const base = [
    { id: "a1", label: "Assignment 1", progress: 75 },
    { id: "a2", label: "Assignment 2", progress: 75 },
    { id: "a3", label: "Assignment 3", progress: 75 },
    { id: "a4", label: "Assignment 4", progress: 75 },
    { id: "a5", label: "Assignment 5", progress: 75 },
    { id: "a6", label: "Assignment 6", progress: 75 },
  ];

  // small deterministic variation so every subject isn't identical
  const seed = (subject?.id || subject?.code || subject?.name || "").length;
  return base.map((a, idx) => ({
    ...a,
    id: `${subject?.id || "sub"}-${a.id}`,
    progress: Math.max(10, Math.min(95, a.progress - ((seed + idx) % 6) * 3)),
  }));
};

const DashboardPage = () => {
  const location = useLocation();
  const { getCourses, getCourseById, loading, error } = useFacultyData();

  const courses = getCourses();

  const [selectedCourseId, setSelectedCourseId] = useState("");

  const effectiveCourseId = useMemo(() => {
    return (
      selectedCourseId ||
      location.state?.courseId ||
      courses?.[0]?.id ||
      ""
    );
  }, [selectedCourseId, location.state, courses]);

  const selectedCourse = useMemo(() => {
    if (!effectiveCourseId) return null;
    return getCourseById(effectiveCourseId);
  }, [getCourseById, effectiveCourseId]);

  const subjects = useMemo(() => {
    return selectedCourse?.subjects || [];
  }, [selectedCourse]);

  const subjectCards = useMemo(() => {
    return subjects.map((s) => ({
      id: s.id,
      title: s.name,
      assignments: buildMockAssignments(s),
    }));
  }, [subjects]);

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">Error loading dashboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-semibold mb-1">
            {selectedCourse ? `${selectedCourse.code}: ${selectedCourse.name}` : "Dashboard"}
          </h3>
          <div className="text-muted small">Track subject and assignment progress</div>
        </div>

        <div style={{ minWidth: 220 }}>
          <select
            className="form-select"
            value={effectiveCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={courses.length === 0}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-4">
        {subjectCards.length === 0 ? (
          <div className="col-12">
            <div className="text-muted">No subjects found for this course</div>
          </div>
        ) : (
          subjectCards.map((s) => (
            <div key={s.id} className="col-12 col-md-6 col-xl-4">
              <FacultySubjectProgressCard title={s.title} assignments={s.assignments} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
