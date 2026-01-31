import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import academicService from "../../services/api/academicService";
import FacultyAssignedCourseCard from "../../components/faculty/FacultyAssignedCourseCard";

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [facultyAssignments, setFacultyAssignments] = useState([]);

  const requestedBatchId = location.state?.batchId ?? null;

  useEffect(() => {
    if (!user?.userId) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [b, a] = await Promise.all([
          academicService.getBatches(),
          academicService.getSubjectsByFaculty(user.userId),
        ]);

        if (!mounted) return;

        const sortedBatches = (Array.isArray(b) ? b : [])
          .slice()
          .sort((x, y) => {
            const dx = x?.createdAt ? new Date(x.createdAt).getTime() : 0;
            const dy = y?.createdAt ? new Date(y.createdAt).getTime() : 0;
            return dy - dx;
          });

        setBatches(sortedBatches);
        setFacultyAssignments(Array.isArray(a) ? a : []);

        if (selectedBatchId == null) {
          const exists = requestedBatchId != null && sortedBatches.some((bt) => bt?.batchId === requestedBatchId);
          if (exists) {
            setSelectedBatchId(requestedBatchId);
          } else if (sortedBatches.length) {
            setSelectedBatchId(sortedBatches[0]?.batchId ?? null);
          }
        }
      } catch {
        if (!mounted) return;
        setError("Failed to load assigned courses");
        setBatches([]);
        setFacultyAssignments([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [requestedBatchId, user?.userId]);

  const selectedBatch = useMemo(() => {
    if (!selectedBatchId) return null;
    return (Array.isArray(batches) ? batches : []).find((b) => b?.batchId === selectedBatchId) || null;
  }, [batches, selectedBatchId]);

  const courses = useMemo(() => {
    const batchName = selectedBatch?.batchName;
    const assignments = Array.isArray(facultyAssignments) ? facultyAssignments : [];
    const filtered = batchName ? assignments.filter((a) => a?.batchName === batchName) : [];

    const byCourseCode = new Map();
    filtered.forEach((a) => {
      const courseCode = a?.courseCode;
      if (!courseCode) return;

      if (!byCourseCode.has(courseCode)) {
        byCourseCode.set(courseCode, {
          courseCode,
          courseName: a?.courseName || courseCode,
          batchName: a?.batchName,
          subjects: [],
        });
      }

      byCourseCode.get(courseCode).subjects.push({
        batchCourseSubjectId: a?.batchCourseSubjectId,
        subjectCode: a?.subjectCode,
        subjectName: a?.subjectName,
      });
    });

    return Array.from(byCourseCode.values());
  }, [facultyAssignments, selectedBatch]);

  const handleCourseClick = (course) => {
    navigate("/faculty/subjects", {
      state: {
        batchId: selectedBatchId,
        batchName: selectedBatch?.batchName,
        courseCode: course?.courseCode,
        courseName: course?.courseName,
        subjects: course?.subjects,
      },
    });
  };

  if (authLoading) {
    return (
      <div className="container-fluid">
        <div className="text-center">
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  if (!user?.userId) {
    return (
      <div className="container-fluid">
        <div className="alert alert-warning">Please login again to view your assigned courses.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center">
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">
          Error loading courses: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="text-center mb-4">
        <h2 className="fw-semibold">Your Assigned Courses</h2>
      </div>

      {batches.length ? (
        <ul className="nav nav-tabs justify-content-center mb-4" role="tablist" style={{ flexWrap: "wrap" }}>
          {batches.map((b) => (
            <li className="nav-item" role="presentation" key={b?.batchId ?? b?.batchName}>
              <button
                type="button"
                className={`nav-link ${b?.batchId === selectedBatchId ? "active" : ""}`}
                onClick={() => setSelectedBatchId(b?.batchId ?? null)}
                style={{
                  color: b?.batchId === selectedBatchId ? "#555c64ff" : "#6c757d",
                  backgroundColor: b?.batchId === selectedBatchId ? "#fff" : "transparent",
                  borderColor: b?.batchId === selectedBatchId ? "#dee2e6 #dee2e6 #fff" : "transparent",
                  borderBottom: b?.batchId === selectedBatchId ? "1px solid #fff" : "none",
                }}
              >
                {b?.batchName || `Batch ${b?.batchId ?? ""}`}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="row g-4 justify-content-center">
        {!loading && selectedBatchId && courses.length === 0 ? (
          <div className="text-center text-muted py-4">No assigned courses for this batch.</div>
        ) : null}

        {courses.map((course) => (
          <div key={course.courseCode} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <div style={{ cursor: "pointer" }} onClick={() => handleCourseClick(course)}>
              <FacultyAssignedCourseCard
                title={`${course.courseCode} - ${course.courseName}`}
                description={`${course.subjects?.length || 0} subjects assigned`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
