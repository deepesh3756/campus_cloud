import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateFormatter';

const AssignmentCard = ({ assignment }) => {
  return (
    <div className="assignment-card">
      <div className="assignment-card-header">
        <h3 className="assignment-card-title">{assignment.title}</h3>
        <span className={`assignment-card-status status-${assignment.status}`}>
          {assignment.status}
        </span>
      </div>
      <p className="assignment-card-description">{assignment.description}</p>
      <div className="assignment-card-meta">
        <span>Due: {formatDate(assignment.dueDate)}</span>
        <span>Subject: {assignment.subject}</span>
      </div>
      <Link to={`/student/assignments/${assignment.id}`} className="assignment-card-link">
        View Details
      </Link>
    </div>
  );
};

export default AssignmentCard;
