import { useState } from 'react';

const EvaluationForm = ({ submission, onSubmit }) => {
  const [formData, setFormData] = useState({
    marks: submission?.marks || '',
    feedback: submission?.feedback || '',
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
      onSubmit({
        submissionId: submission?.id,
        ...formData,
      });
    }
  };

  return (
    <form className="evaluation-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="marks">Marks</label>
        <input
          type="number"
          id="marks"
          name="marks"
          value={formData.marks}
          onChange={handleChange}
          min="0"
          max={submission?.maxMarks || 100}
          required
        />
        <span>/ {submission?.maxMarks || 100}</span>
      </div>
      <div className="form-group">
        <label htmlFor="feedback">Feedback</label>
        <textarea
          id="feedback"
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          rows={6}
          required
        />
      </div>
      <button type="submit">Submit Evaluation</button>
    </form>
  );
};

export default EvaluationForm;
