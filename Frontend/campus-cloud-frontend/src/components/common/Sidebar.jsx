import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  House,
  Book,
  FileText,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useFacultyData } from "../../context/FacultyContext";

import "./Sidebar.css";

const STUDENT_MENU_ITEMS = [
  {
    label: "Dashboard",
    icon: House,
    path: "/student/dashboard",
  },
  {
    label: "Overview",
    icon: FileText,
    path: "/student/overview",
  },
  {
    label: "Subject List",
    icon: Book,
    children: [
      { label: "C++", path: "/student/subjects/cpp" },
      { label: "Database Technologies", path: "/student/subjects/dbms" },
      { label: "OOP with Java", path: "/student/subjects/java" },
      { label: "Algorithms & Data Structures", path: "/student/subjects/dsa" },
      { label: "Web Programming Technologies", path: "/student/subjects/web" },
      { label: "Microsoft .NET Technologies", path: "/student/subjects/dotnet" },
    ],
  },
];

const SidebarItem = ({ item, collapsed, onCourseSelect }) => {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;
  const navigate = useNavigate();

  /* =======================
     DROPDOWN ITEM
  ======================= */
  if (item.children) {
    const handleDropdownToggle = () => {
      // If clicking on the chevron or icon area
      setOpen(!open);
    };

    const handleLabelClick = () => {
      // If clicking on the label text, navigate to the path
      if (item.path) {
        navigate(item.path, item.state ? { state: item.state } : undefined);
      }
    };

    return (
      <li className="sidebar-dropdown">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderRadius: "10px",
            color: "#374151",
            fontWeight: 500,
            transition: "0.2s",
          }}
        >
          <button
            type="button"
            className="sidebar-link sidebar-dropdown-toggle"
            onClick={handleLabelClick}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "0",
              border: "none",
              background: "none",
              cursor: "pointer",
              gap: "14px",
            }}
          >
            <div className="sidebar-link-content">
              {Icon ? <Icon size={20} /> : null}
              {!collapsed && <span>{item.label}</span>}
            </div>
          </button>

          {!collapsed && (
            <button
              type="button"
              onClick={handleDropdownToggle}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
                color: "#d1d5db",
              }}
            >
              {open ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          )}
        </div>

        {!collapsed && open && (
          <ul className="sidebar-submenu">
            {item.children.map((child, index) => (
              <li key={index}>
                {child.children ? (
                  <SidebarItem item={child} collapsed={collapsed} onCourseSelect={onCourseSelect} />
                ) : (
                  child.courseId ? (
                    <button
                      className="sidebar-sublink"
                      onClick={() => onCourseSelect?.(child.courseId)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "block",
                        padding: "8px 0",
                        fontSize: "14px",
                        color: "#6b7280",
                        textDecoration: "none",
                        width: "100%",
                        textAlign: "left",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#4f46e5")}
                      onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
                    >
                      {child.label}
                    </button>
                  ) : (
                    <NavLink to={child.path} state={child.state} className="sidebar-sublink">
                      {child.label}
                    </NavLink>
                  )
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  /* =======================
     NORMAL LINK
  ======================= */
  return (
    <li>
      <NavLink to={item.path} state={item.state} className="sidebar-link">
        <div className="sidebar-link-content">
          {Icon ? <Icon size={20} /> : null}
          {!collapsed && <span>{item.label}</span>}
        </div>
      </NavLink>
    </li>
  );
};

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getCourses } = useFacultyData();

  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("campuscloud.sidebar.collapsed");
    if (stored === null) return false;
    return stored === "true";
  });

  useEffect(() => {
    localStorage.setItem("campuscloud.sidebar.collapsed", String(collapsed));
  }, [collapsed]);

  // Generate faculty menu items dynamically from context
  const getFacultyMenuItems = () => {
    const courses = getCourses();
    return [
      {
        label: "Dashboard",
        icon: House,
        path: "/faculty/dashboard",
      },
      {
        label: "Courses",
        icon: GraduationCap,
        children: courses.map((course) => ({
          label: course.code,
          path: "/faculty/subjects",
          state: { courseId: course.id },
          children: (course.subjects || []).map((subject) => ({
            label: subject.name,
            path: "/faculty/assignments",
            state: {
              courseId: course.id,
              courseName: course.code,
              subjectId: subject.id,
              subjectName: subject.name,
            },
          })),
        })),
      },
    ];
  };

  const handleCourseSelect = (courseId) => {
    navigate("/faculty/subjects", { state: { courseId } });
  };

  const menuItems = user?.role === "faculty" ? getFacultyMenuItems() : STUDENT_MENU_ITEMS;

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* HEADER */}
      <div className="sidebar-header">
        {!collapsed && (
          <span className="sidebar-title">Navigation</span>
        )}

        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? (
            <PanelLeft size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* MENU */}
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            collapsed={collapsed}
            onCourseSelect={handleCourseSelect}
          />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
