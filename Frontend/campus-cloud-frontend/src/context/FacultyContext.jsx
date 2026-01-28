import { createContext, useContext, useState, useEffect } from "react";

const FacultyContext = createContext();

// Mock data - This will be replaced with API calls
const MOCK_FACULTY_DATA = {
  courses: [
    {
      id: "pgdac",
      code: "PG-DAC",
      label: "PG-DAC",
      name: "Post Graduate Diploma in Advanced Computing",
      description: "Advanced computing program",
      subjects: [
        { id: "dac101", code: "DAC101", name: "C++" },
        { id: "dac102", code: "DAC102", name: "Operating Systems" },
        { id: "dac103", code: "DAC103", name: "Java" },
        { id: "dac104", code: "DAC104", name: "Web Based Java" },
        { id: "dac105", code: "DAC105", name: "Data structures and algorithm" },
      ],
    },
    {
      id: "pgdai",
      code: "PG-DAI",
      label: "PG-DAI",
      name: "Post Graduate Diploma in Artificial Intelligence",
      description: "AI and Machine Learning program",
      subjects: [
        { id: "dai101", code: "DAI101", name: "Python" },
        { id: "dai102", code: "DAI102", name: "Machine Learning" },
      ],
    },
    {
      id: "pgdbda",
      code: "PG-DBDA",
      label: "PG-DBDA",
      name: "Post Graduate Diploma in Big Data and Data Analytics",
      description: "Big data program",
      subjects: [
        { id: "dbda101", code: "DBDA101", name: "Big Data" },
        { id: "dbda102", code: "DBDA102", name: "Data Warehousing" },
      ],
    },
  ],
};

export const FacultyProvider = ({ children }) => {
  const [facultyData, setFacultyData] = useState(MOCK_FACULTY_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch faculty data from API
  // This function will be called to fetch from backend
  const fetchFacultyData = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/faculty/courses-and-subjects');
      // const data = await response.json();
      // setFacultyData(data);

      // For now, using mock data
      setFacultyData(MOCK_FACULTY_DATA);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching faculty data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchFacultyData();
  }, []);

  // Get all courses
  const getCourses = () => facultyData.courses || [];

  // Get a specific course by ID
  const getCourseById = (courseId) => {
    return facultyData.courses?.find((c) => c.id === courseId || c.code === courseId);
  };

  // Get subjects for a specific course
  const getSubjectsByCourse = (courseId) => {
    const course = getCourseById(courseId);
    return course?.subjects || [];
  };

  // Get a specific subject
  const getSubjectById = (courseId, subjectId) => {
    const subjects = getSubjectsByCourse(courseId);
    return subjects.find((s) => s.id === subjectId || s.code === subjectId);
  };

  const value = {
    facultyData,
    loading,
    error,
    getCourses,
    getCourseById,
    getSubjectsByCourse,
    getSubjectById,
    refetch: fetchFacultyData,
  };

  return (
    <FacultyContext.Provider value={value}>{children}</FacultyContext.Provider>
  );
};

export const useFacultyData = () => {
  const context = useContext(FacultyContext);
  if (!context) {
    throw new Error("useFacultyData must be used within FacultyProvider");
  }
  return context;
};
