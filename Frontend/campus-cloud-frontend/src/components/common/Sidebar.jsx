import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  House,
  Book,
  FileText,
  GraduationCap,
  Layers,
  BookOpen,
  Users,
  User,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useFacultyData } from "../../context/FacultyContext";
import assignmentService from "../../services/api/assignmentService";

import "./Sidebar.css";

const STUDENT_MENU_ITEMS = [
  {
    label: "Dashboard",
    icon: House,
    path: "/student/dashboard",
  },
  {
    label: "Subject List",
    icon: Book,
    path: "/student/subjects",
    children: [],
  },
];

const SidebarItem = ({ item, collapsed, onCourseSelect }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const Icon = item.icon;

  /* =======================
     DROPDOWN ITEM
  ======================= */
  if (item.children) {
    const isActive =
      !!item.path &&
      (location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`) ||
        location.pathname.startsWith("/student/assignments"));

    const handleRowClick = () => {
      if (collapsed) {
        navigate(item.path);
        return;
      }

      setOpen((prev) => !prev);
    };

    const handleLabelClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(item.path);
    };

    const handleChevronClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen((prev) => !prev);
    };

    return (
      <li className="sidebar-dropdown">
        <div
          className={`sidebar-link sidebar-dropdown-toggle ${isActive ? "active" : ""}`}
          onClick={handleRowClick}
          role="button"
          tabIndex={0}
          title={collapsed ? item.label : undefined}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleRowClick();
            }
          }}
          style={{ justifyContent: "space-between" }}
        >
          <div className="sidebar-link-content">
            {Icon ? <Icon size={20} /> : null}
            {!collapsed ? (
              <button
                type="button"
                onClick={handleLabelClick}
                style={{
                  color: "inherit",
                  background: "none",
                  border: "none",
                  padding: 0,
                  font: "inherit",
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ) : null}
          </div>

          {!collapsed ? (
            <button
              type="button"
              onClick={handleChevronClick}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
                color: "#d1d5db",
              }}
              aria-label={open ? "Collapse" : "Expand"}
            >
              {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : null}
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
      <NavLink
        to={item.path}
        state={item.state}
        className="sidebar-link"
        title={collapsed ? item.label : undefined}
      >
        <div className="sidebar-link-content">
          {Icon ? <Icon size={20} /> : null}
          {!collapsed && <span>{item.label}</span>}
        </div>
      </NavLink>
    </li>
  );
};

const Sidebar = ({ menuItems: menuItemsProp }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getCourses } = useFacultyData();

  const [studentSubjects, setStudentSubjects] = useState([]);

  useEffect(() => {
    if (!user?.role || user.role !== "student") return;
    if (!user?.userId) return;

    let isMounted = true;
    const load = async () => {
      try {
        const data = await assignmentService.getStudentSubjectAssignments();
        if (!isMounted) return;
        setStudentSubjects(Array.isArray(data) ? data : []);
      } catch {
        if (!isMounted) return;
        setStudentSubjects([]);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [user?.role, user?.userId]);

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

  const adminMenuItems = [
    {
      label: "Dashboard",
      icon: House,
      path: "/admin/dashboard",
    },
    {
      label: "Batches",
      icon: Layers,
      path: "/admin/batches",
    },
    {
      label: "Courses",
      icon: GraduationCap,
      path: "/admin/courses",
    },
    {
      label: "Subjects",
      icon: BookOpen,
      path: "/admin/subjects",
    },
    {
      label: "Students",
      icon: Users,
      path: "/admin/students",
    },
    {
      label: "Faculty",
      icon: User,
      path: "/admin/faculty",
    },
    {
      label: "Assignments",
      icon: ClipboardList,
      path: "/faculty",
    },
  ];

  const studentMenuItems = useMemo(() => {
    const base = Array.isArray(STUDENT_MENU_ITEMS) ? STUDENT_MENU_ITEMS : [];
    const subjects = Array.isArray(studentSubjects) ? studentSubjects : [];

    return base.map((item) => {
      if (item.path !== "/student/subjects") return item;
      return {
        ...item,
        children: subjects.map((s) => {
          const label = s.subjectName || s.subjectCode || "Subject";
          const key = s.batchCourseSubjectId ?? s.subjectId ?? s.subjectCode ?? label;
          return {
            label,
            path: `/student/subjects/${encodeURIComponent(String(key))}`,
            state: {
              subjectName: s.subjectName,
              subjectCode: s.subjectCode,
              batchCourseSubjectId: s.batchCourseSubjectId,
              subjectId: s.subjectId,
            },
          };
        }),
      };
    });
  }, [studentSubjects]);

  const menuItems =
    menuItemsProp ||
    (user?.role === "admin"
      ? adminMenuItems
      : user?.role === "faculty"
        ? getFacultyMenuItems()
        : studentMenuItems);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* HEADER */}
      <div className="sidebar-header">
        {!collapsed && (
          <span className="sidebar-title">Navigation</span>
        )}

        <button
          className="sidebar-collapse-btn"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
