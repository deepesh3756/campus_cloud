import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "./AdminBreadcrumb.css";

const AdminBreadcrumb = ({ items = [] }) => {
  if (!items?.length) return null;

  return (
    <div className="admin-breadcrumb">
      <div className="admin-breadcrumb-content">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <div className="admin-breadcrumb-item" key={`${item.label}-${idx}`}>
              {item.to && !isLast ? (
                <NavLink to={item.to} className="admin-breadcrumb-link">
                  {item.label}
                </NavLink>
              ) : (
                <span className={isLast ? "admin-breadcrumb-current" : "admin-breadcrumb-text"}>
                  {item.label}
                </span>
              )}

              {!isLast ? (
                <ChevronRight size={18} className="admin-breadcrumb-separator" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBreadcrumb;
