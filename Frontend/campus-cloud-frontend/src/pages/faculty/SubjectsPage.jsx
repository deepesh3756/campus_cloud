import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFacultyData } from "../../context/FacultyContext";
import CourseBreadcrumb from "../../components/faculty/CourseBreadcrumb";

const SubjectsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCourseById, loading, error } = useFacultyData();

  // Get courseId from location state or use default
  const courseId = location.state?.courseId || "pgdac";
  const course = getCourseById(courseId);

  const handleSubjectSelect = (subject) => {
    navigate("/faculty/assignments", {
      state: {
        courseId: course.id,
        courseName: course.code,
        subjectId: subject.id,
        subjectName: subject.name,
      },
    });
  };

  if (loading) {
    return (
      <div className="faculty-subjects-page">
        <p>Loading subjects...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="faculty-subjects-page">
        <div className="alert alert-danger">
          Error loading course data: {error || "Course not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="faculty-subjects-page">
      {/* Breadcrumb Component */}
      <CourseBreadcrumb courseName={course.code} />

      {/* Subject List */}
      <div className="subject-list-container">
        <h3 className="subject-list-title">Subject List</h3>
        <div className="table-responsive">
          <table className="subject-table">
            <thead>
              <tr>
                <th>S.no</th>
                <th>Subject ID</th>
                <th>Subject Name</th>
              </tr>
            </thead>
            <tbody>
              {course.subjects.map((subject, index) => (
                <tr key={subject.id}>
                  <td>{index + 1}</td>
                  <td>{subject.code}</td>
                  <td>
                    <button
                      className="subject-link"
                      onClick={() => handleSubjectSelect(subject)}
                    >
                      {subject.name}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .faculty-subjects-page {
          padding: 24px;
        }

        .subject-list-container {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .subject-list-title {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .subject-table {
          width: 100%;
          border-collapse: collapse;
        }

        .subject-table thead {
          background: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }

        .subject-table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #6b7280;
          font-size: 14px;
        }

        .subject-table tbody tr {
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s;
        }

        .subject-table tbody tr:hover {
          background-color: #f9fafb;
        }

        .subject-table td {
          padding: 12px 16px;
          color: #374151;
          font-size: 14px;
        }

        .subject-link {
          background: none;
          border: none;
          color: #4f46e5;
          cursor: pointer;
          font-weight: 500;
          padding: 0;
          text-decoration: none;
          transition: color 0.2s;
        }

        .subject-link:hover {
          color: #4338ca;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default SubjectsPage;
