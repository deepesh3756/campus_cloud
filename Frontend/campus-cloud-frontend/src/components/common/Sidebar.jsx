import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  House,
  Book,
  FileText,
  ChevronDown,
  ChevronRight,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";

import "./Sidebar.css";

const menuItems = [
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

const SidebarItem = ({ item, collapsed }) => {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  /* =======================
     DROPDOWN ITEM
  ======================= */
  if (item.children) {
    return (
      <li className="sidebar-dropdown">
        <button
          type="button"
          className="sidebar-link sidebar-dropdown-toggle"
          onClick={() => setOpen(!open)}
        >
          <div className="sidebar-link-content">
            <Icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </div>

          {!collapsed && (
            open ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )
          )}
        </button>

        {!collapsed && open && (
          <ul className="sidebar-submenu">
            {item.children.map((child, index) => (
              <li key={index}>
                <NavLink
                  to={child.path}
                  className="sidebar-sublink"
                >
                  {child.label}
                </NavLink>
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
      <NavLink to={item.path} className="sidebar-link">
        <div className="sidebar-link-content">
          <Icon size={20} />
          {!collapsed && <span>{item.label}</span>}
        </div>
      </NavLink>
    </li>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("campuscloud.sidebar.collapsed");
    if (stored === null) return false;
    return stored === "true";
  });

  useEffect(() => {
    localStorage.setItem("campuscloud.sidebar.collapsed", String(collapsed));
  }, [collapsed]);

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
          />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
