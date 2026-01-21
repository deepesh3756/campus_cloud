import { useState } from 'react';
import { useParams } from 'react-router-dom';
import SubmissionForm from '../../components/student/SubmissionForm';

const AssignmentDetailPage = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);

  const handleSubmit = (submissionData) => {
    console.log('Submitting:', submissionData);
  };

  return (
    <div className="assignment-detail-page">
      {assignment ? (
        <>
          <h2>{assignment.title}</h2>
          <p>{assignment.description}</p>
          <SubmissionForm assignmentId={id} onSubmit={handleSubmit} />
        </>
      ) : (
        <p>Loading assignment details...</p>
      )}
    </div>
  );
};

export default AssignmentDetailPage;
