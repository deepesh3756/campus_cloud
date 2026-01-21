import { useState } from 'react';

const FacultyManagement = () => {
  const [faculties, setFaculties] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="faculty-management">
      <div className="page-header">
        <h2>Faculty Management</h2>
        <button onClick={() => setIsFormOpen(true)}>Add New Faculty</button>
      </div>
      <div className="faculty-list">
        {faculties.length === 0 ? (
          <p>No faculties found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty) => (
                <tr key={faculty.id}>
                  <td>{faculty.name}</td>
                  <td>{faculty.email}</td>
                  <td>{faculty.department}</td>
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

export default FacultyManagement;
