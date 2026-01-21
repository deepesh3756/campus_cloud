import { useState } from 'react';

const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="batch-management">
      <div className="page-header">
        <h2>Batch Management</h2>
        <button onClick={() => setIsFormOpen(true)}>Add New Batch</button>
      </div>
      <div className="batch-list">
        {batches.length === 0 ? (
          <p>No batches found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td>{batch.name}</td>
                  <td>{batch.startDate}</td>
                  <td>{batch.endDate}</td>
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

export default BatchManagement;
