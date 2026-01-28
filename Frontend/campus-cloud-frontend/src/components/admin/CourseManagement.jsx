import { useState } from 'react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="course-management">
      <div className="page-header">
        <h2>Course Management</h2>
        <button onClick={() => setIsFormOpen(true)}>Add New Course</button>
      </div>
      <div className="course-list">
        {courses.length === 0 ? (
          <p>No courses found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{course.duration}</td>
                  <td>
                    <button>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
