import { ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import "./CourseBreadcrumb.css";

const CourseBreadcrumb = ({
  batchId,
  batchName,
  courseName,
  subjectName,
  assignmentTitle,
  state,
}) => {
  const location = useLocation();
  const navState = state ?? location.state;

  return (
    <div className="course-breadcrumb">
      <div className="breadcrumb-content">
        {/* Batch Name */}
        {batchName && (
          <>
            <NavLink
              to="/faculty"
              state={{ batchId }}
              className="breadcrumb-link"
              end
            >
              {batchName}
            </NavLink>
            {(courseName || subjectName) && (
              <ChevronRight size={20} className="breadcrumb-separator" />
            )}
          </>
        )}

        {/* Course Name */}
        {courseName && (
          <>
            <NavLink
              to="/faculty/subjects"
              state={navState}
              className="breadcrumb-link"
            >
              {courseName}
            </NavLink>
            {(subjectName || assignmentTitle) && (
              <ChevronRight size={20} className="breadcrumb-separator" />
            )}
          </>
        )}

        {/* Subject Name */}
        {subjectName && !assignmentTitle ? (
          <h2 className="breadcrumb-subject">{subjectName}</h2>
        ) : null}

        {subjectName && assignmentTitle ? (
          <>
            <NavLink
              to="/faculty/assignments"
              state={navState}
              className="breadcrumb-link"
            >
              {subjectName}
            </NavLink>
            <ChevronRight size={20} className="breadcrumb-separator" />
            <h2 className="breadcrumb-subject">{assignmentTitle}</h2>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CourseBreadcrumb;
