import { useState } from 'react';
import { useFileUpload } from '../../hooks/useFileUpload';

const SubmissionForm = ({ assignmentId, onSubmit }) => {
  const [comment, setComment] = useState('');
  const { handleFileChange, file, uploading, error } = useFileUpload();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        assignmentId,
        comment,
        file,
      });
    }
  };

  return (
    <form className="submission-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="comment">Comments</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
      </div>
      <div className="form-group">
        <label htmlFor="file">Upload File</label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
        {error && <span className="error-message">{error}</span>}
      </div>
      <button type="submit" disabled={uploading || !file}>
        {uploading ? 'Uploading...' : 'Submit Assignment'}
      </button>
    </form>
  );
};

export default SubmissionForm;
