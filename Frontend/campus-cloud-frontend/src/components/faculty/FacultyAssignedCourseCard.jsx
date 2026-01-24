import { BookOpen } from "lucide-react";

const FacultyAssignedCourseCard = ({ title, description, icon }) => {
  const IconComponent = icon || BookOpen;

  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body p-4">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-4 mb-3"
          style={{ width: 56, height: 56, background: "rgba(79,70,229,0.1)", color: "#4f46e5" }}
        >
          <IconComponent size={26} />
        </div>

        <h6 className="fw-semibold mb-2">{title}</h6>
        <p className="text-muted small mb-0">{description}</p>
      </div>
    </div>
  );
};

export default FacultyAssignedCourseCard;
