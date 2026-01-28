import { useState } from 'react';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="student-management">
      <div className="page-header">
        <h2>Student Management</h2>
        <button onClick={() => setIsFormOpen(true)}>Add New Student</button>
      </div>
      <div className="student-list">
        {students.length === 0 ? (
          <p>No students found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Batch</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.batch}</td>
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

export default StudentManagement;
