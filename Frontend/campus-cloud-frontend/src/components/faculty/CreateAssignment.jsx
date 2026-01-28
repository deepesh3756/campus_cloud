import { useState } from 'react';

const CreateAssignment = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    dueDate: '',
    maxMarks: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form className="create-assignment-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="subjectId">Subject</label>
        <select
          id="subjectId"
          name="subjectId"
          value={formData.subjectId}
          onChange={handleChange}
          required
        >
          <option value="">Select Subject</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="datetime-local"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="maxMarks">Maximum Marks</label>
        <input
          type="number"
          id="maxMarks"
          name="maxMarks"
          value={formData.maxMarks}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Create Assignment</button>
    </form>
  );
};

export default CreateAssignment;
