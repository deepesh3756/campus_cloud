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
import academicService from "../../services/api/academicService";

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

  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("campuscloud.sidebar.collapsed");
    if (stored === null) return false;
    return stored === "true";
  });

  useEffect(() => {
    localStorage.setItem("campuscloud.sidebar.collapsed", String(collapsed));
  }, [collapsed]);

  const [studentSubjects, setStudentSubjects] = useState([]);

  const [facultyBatches, setFacultyBatches] = useState([]);
  const [facultyAssignments, setFacultyAssignments] = useState([]);
  const [latestBatchOpen, setLatestBatchOpen] = useState(true);
  const [openCourses, setOpenCourses] = useState({});

  useEffect(() => {
    if (collapsed) return;
    setLatestBatchOpen(true);
  }, [collapsed]);

  useEffect(() => {
    if (collapsed) return;
    setOpenCourses({});
  }, [collapsed]);

  useEffect(() => {
    if (user?.role !== "faculty") return;
    if (!user?.userId) return;

    let mounted = true;
    (async () => {
      try {
        const [b, a] = await Promise.all([
          academicService.getBatches(),
          academicService.getSubjectsByFaculty(user.userId),
        ]);

        if (!mounted) return;
        const sortedBatches = (Array.isArray(b) ? b : [])
          .slice()
          .sort((x, y) => {
            const dx = x?.createdAt ? new Date(x.createdAt).getTime() : 0;
            const dy = y?.createdAt ? new Date(y.createdAt).getTime() : 0;
            return dy - dx;
          });

        setFacultyBatches(sortedBatches);
        setFacultyAssignments(Array.isArray(a) ? a : []);
      } catch {
        if (!mounted) return;
        setFacultyBatches([]);
        setFacultyAssignments([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user?.role, user?.userId]);

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

  // Generate faculty menu items dynamically from context
  const getFacultyMenuItems = () => {
    const courses = getCourses();
    return [
      {
        label: "Homepage",
        icon: House,
        path: "/faculty",
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

  const latestBatchTree = useMemo(() => {
    const latestBatch = (Array.isArray(facultyBatches) ? facultyBatches : [])[0] || null;
    const batchName = latestBatch?.batchName || "";
    const assignments = Array.isArray(facultyAssignments) ? facultyAssignments : [];
    const filtered = batchName ? assignments.filter((a) => a?.batchName === batchName) : [];

    const byCourseCode = new Map();
    filtered.forEach((a) => {
      const courseCode = a?.courseCode;
      if (!courseCode) return;
      if (!byCourseCode.has(courseCode)) {
        byCourseCode.set(courseCode, {
          courseCode,
          courseName: a?.courseName || courseCode,
          subjects: [],
        });
      }
      byCourseCode.get(courseCode).subjects.push({
        batchCourseSubjectId: a?.batchCourseSubjectId,
        subjectId: a?.subjectId,
        subjectName: a?.subjectName,
        subjectCode: a?.subjectCode,
      });
    });

    const courses = Array.from(byCourseCode.values()).map((c) => ({
      ...c,
      subjects: (Array.isArray(c.subjects) ? c.subjects : []).filter((s) => s?.subjectName || s?.subjectCode),
    }));

    return {
      latestBatch,
      courses,
    };
  }, [facultyBatches, facultyAssignments]);

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
        {user?.role === "faculty" && !menuItemsProp ? (
          <>
            <SidebarItem item={menuItems[0]} collapsed={collapsed} onCourseSelect={handleCourseSelect} />

            <li className="sidebar-dropdown">
              <div
                className={`sidebar-link sidebar-dropdown-toggle ${latestBatchOpen ? "active" : ""}`}
                onClick={() => {
                  if (collapsed) {
                    setCollapsed(false);
                    return;
                  }
                  setLatestBatchOpen((prev) => !prev);
                }}
                role="button"
                tabIndex={0}
                title={collapsed ? (latestBatchTree?.latestBatch?.batchName || "Latest Batch") : undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (collapsed) {
                      setCollapsed(false);
                      return;
                    }
                    setLatestBatchOpen((prev) => !prev);
                  }
                }}
                style={{ justifyContent: "space-between" }}
              >
                <div className="sidebar-link-content">
                  <GraduationCap size={20} />
                  {!collapsed ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      style={{
                        color: "inherit",
                        background: "none",
                        border: "none",
                        padding: 0,
                        font: "inherit",
                        cursor: "default",
                        textAlign: "left",
                      }}
                    >
                      {latestBatchTree?.latestBatch?.batchName || "Latest Batch"}
                    </button>
                  ) : null}
                </div>

                {!collapsed ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLatestBatchOpen((prev) => !prev);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      color: "#d1d5db",
                    }}
                    aria-label={latestBatchOpen ? "Collapse" : "Expand"}
                  >
                    {latestBatchOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                ) : null}
              </div>

              {!collapsed && latestBatchOpen ? (
                <ul className="sidebar-submenu">
                  {(latestBatchTree?.courses || []).map((course) => {
                    const isOpen = !!openCourses[course.courseCode];
                    return (
                      <li key={course.courseCode}>
                        <div
                          className="sidebar-dropdown-toggle"
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            navigate("/faculty/subjects", {
                              state: {
                                batchId: latestBatchTree?.latestBatch?.batchId,
                                batchName: latestBatchTree?.latestBatch?.batchName,
                                courseCode: course.courseCode,
                                courseName: course.courseName,
                                subjects: course.subjects,
                              },
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              navigate("/faculty/subjects", {
                                state: {
                                  batchId: latestBatchTree?.latestBatch?.batchId,
                                  batchName: latestBatchTree?.latestBatch?.batchName,
                                  courseCode: course.courseCode,
                                  courseName: course.courseName,
                                  subjects: course.subjects,
                                },
                              });
                            }
                          }}
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 0",
                            borderRadius: 8,
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate("/faculty/subjects", {
                                state: {
                                  batchId: latestBatchTree?.latestBatch?.batchId,
                                  batchName: latestBatchTree?.latestBatch?.batchName,
                                  courseCode: course.courseCode,
                                  courseName: course.courseName,
                                  subjects: course.subjects,
                                },
                              });
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              font: "inherit",
                              cursor: "pointer",
                              color: "#6b7280",
                              textAlign: "left",
                            }}
                            onMouseEnter={(e) => (e.target.style.color = "#4f46e5")}
                            onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
                          >
                            {course.courseCode}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenCourses((prev) => ({
                                ...(prev || {}),
                                [course.courseCode]: !prev?.[course.courseCode],
                              }));
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "0",
                              display: "flex",
                              alignItems: "center",
                              color: "#d1d5db",
                            }}
                            aria-label={isOpen ? "Collapse" : "Expand"}
                          >
                            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        </div>

                        {isOpen ? (
                          <ul className="sidebar-submenu">
                            {(course.subjects || []).map((s) => (
                              <li key={s.batchCourseSubjectId ?? `${course.courseCode}-${s.subjectId}-${s.subjectCode}`}>
                                <NavLink
                                  to="/faculty/assignments"
                                  state={{
                                    batchId: latestBatchTree?.latestBatch?.batchId,
                                    batchName: latestBatchTree?.latestBatch?.batchName,
                                    courseCode: course.courseCode,
                                    courseName: course.courseName,
                                    subjectId: s.subjectId,
                                    subjectName: s.subjectName,
                                    subjectCode: s.subjectCode,
                                    batchCourseSubjectId: s.batchCourseSubjectId,
                                  }}
                                  className="sidebar-sublink"
                                >
                                  {s.subjectName || s.subjectCode}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          </>
        ) : (
          menuItems.map((item, index) => (
            <SidebarItem
              key={index}
              item={item}
              collapsed={collapsed}
              onCourseSelect={handleCourseSelect}
            />
          ))
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
