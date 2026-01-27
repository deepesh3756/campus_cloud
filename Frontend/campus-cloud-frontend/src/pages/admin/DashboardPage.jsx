import { useNavigate } from "react-router-dom";
import {
  Layers,
  GraduationCap,
  BookOpen,
  Users,
  User,
  ClipboardList,
} from "lucide-react";

const DashboardPage = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Batches",
      description: "Manage all academic batches and their details.",
      icon: Layers,
      to: "/admin/batches",
    },
    {
      title: "Courses",
      description: "Administer course offerings and curriculum structure.",
      icon: GraduationCap,
      to: "/admin/courses",
    },
    {
      title: "Subjects",
      description: "Organize and define academic subjects.",
      icon: BookOpen,
      to: "/admin/subjects",
    },
    {
      title: "Students",
      description: "View and manage student profiles and records.",
      icon: Users,
      to: "/admin/students",
    },
    {
      title: "Faculties",
      description: "Maintain faculty information and assignments.",
      icon: User,
      to: "/admin/faculty",
    },
    {
      title: "Assignments",
      description: "Track and manage assignments for all courses.",
      icon: ClipboardList,
      to: "/faculty",
    },
  ];

  return (
    <div className="admin-dashboard-page">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Dashboard Overview</h2>
        <p className="text-secondary mb-0">
          Welcome, Admin User! Here's a quick summary of your academic operations.
        </p>
      </div>

      <div className="row g-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div className="col-12 col-md-6 col-lg-4" key={card.title}>
              <button
                type="button"
                className="card h-100 border-0 shadow-sm text-start"
                onClick={() => navigate(card.to)}
                style={{ borderRadius: 14 }}
              >
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between gap-3">
                    <div>
                      <h5 className="card-title fw-semibold mb-2">{card.title}</h5>
                      <p className="card-text text-secondary mb-0" style={{ fontSize: 14 }}>
                        {card.description}
                      </p>
                    </div>

                    <div
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "#eef2ff",
                        color: "#4f46e5",
                      }}
                    >
                      <Icon size={22} />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
