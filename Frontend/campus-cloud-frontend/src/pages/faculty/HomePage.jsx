import { useNavigate } from "react-router-dom";
import { useFacultyData } from "../../context/FacultyContext";
import FacultyAssignedCourseCard from "../../components/faculty/FacultyAssignedCourseCard";

const HomePage = () => {
  const navigate = useNavigate();
  const { getCourses, loading, error } = useFacultyData();

  const courses = getCourses();

  const handleCourseClick = (courseId) => {
    navigate("/faculty/subjects", { state: { courseId } });
  };

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

      <div className="row g-4 justify-content-center">
        {courses.map((course) => (
          <div key={course.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleCourseClick(course.id)}
            >
              <FacultyAssignedCourseCard
                title={`${course.code} - ${course.name}`}
                description={course.description}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
