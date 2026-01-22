import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  House,
  Book,
  FileText,
  GraduationCap,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./Sidebar.css";

const menuItems = [
  { label: "Dashboard", icon: House, path: "/student/dashboard" },
  { label: "Subjects", icon: Book, path: "/student/subjects" },
  { label: "Assignments", icon: FileText, path: "/student/assignments" },
  { label: "Submissions", icon: GraduationCap, path: "/student/submissions" },
  { label: "Profile", icon: Users, path: "/student/profile" },
  { label: "Calendar", icon: Calendar, path: "/student/calendar" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* TOGGLE */}
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      {/* MENU */}
      <ul className="sidebar-menu">
        {menuItems.map(({ label, icon: Icon, path }) => (
          <li key={label}>
            <NavLink
              to={path}
              className="sidebar-link"
              title={collapsed ? label : ""}
            >
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
