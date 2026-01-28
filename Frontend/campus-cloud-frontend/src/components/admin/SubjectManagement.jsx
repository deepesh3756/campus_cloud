import { useState } from 'react';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="subject-management">
      <div className="page-header">
        <h2>Subject Management</h2>
        <button onClick={() => setIsFormOpen(true)}>Add New Subject</button>
      </div>
      <div className="subject-list">
        {subjects.length === 0 ? (
          <p>No subjects found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td>{subject.name}</td>
                  <td>{subject.course}</td>
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

export default SubjectManagement;
