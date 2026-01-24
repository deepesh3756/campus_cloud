import { ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import "./CourseBreadcrumb.css";

const CourseBreadcrumb = ({ courseName, subjectName }) => {
  return (
    <div className="course-breadcrumb">
      <div className="breadcrumb-content">
        {/* Course Name */}
        <h1 className="breadcrumb-course">{courseName}</h1>

        {/* Subject Name (if available) */}
        {subjectName && (
          <>
            <ChevronRight size={20} className="breadcrumb-separator" />
            <h2 className="breadcrumb-subject">{subjectName}</h2>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseBreadcrumb;
