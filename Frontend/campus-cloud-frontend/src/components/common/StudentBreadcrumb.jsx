import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "./StudentBreadcrumb.css";

const StudentBreadcrumb = ({ items = [] }) => {
  if (!items?.length) return null;

  return (
    <div className="student-breadcrumb">
      <div className="student-breadcrumb-content">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <div className="student-breadcrumb-item" key={`${item.label}-${idx}`}>
              {item.to && !isLast ? (
                <NavLink to={item.to} state={item.state} className="student-breadcrumb-link">
                  {item.label}
                </NavLink>
              ) : (
                <span className={isLast ? "student-breadcrumb-current" : "student-breadcrumb-text"}>
                  {item.label}
                </span>
              )}

              {!isLast ? (
                <ChevronRight size={18} className="student-breadcrumb-separator" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentBreadcrumb;
