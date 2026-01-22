import { NavLink } from "react-router-dom";
import "./NotificationDropdown.css";

const notifications = [
  {
    id: 1,
    message: "📘 C++ Assignment 4 has been added",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    message: "⏰ Java Assignment 3 deadline is tomorrow",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 3,
    message: "✅ DBMS Assignment 2 evaluated by faculty",
    time: "Yesterday",
    read: true,
  },
  {
    id: 4,
    message: "📢 New announcement posted by Admin",
    time: "2 days ago",
    read: true,
  },
  {
    id: 5,
    message: "📂 Your OS assignment file was successfully submitted",
    time: "Jan 18, 2026",
    read: true,
  },
];

const NotificationDropdown = ({ onClose }) => {
  return (
    <div className="notification-box">

      {/* HEADER */}
      <div className="notification-header">
        <span>Notifications</span>
        <button className="mark-read-btn">
          <i className="bi bi-check2-all"></i>
          Mark all as read
        </button>
      </div>

      {/* LIST */}
      <div className="notification-list">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`notification-item ${
              !item.read ? "unread" : ""
            }`}
          >
            <div className="notification-icon">
              <i className="bi bi-bell-fill"></i>
            </div>

            <div className="notification-content">
              <div className="notification-title">
                {item.message}
              </div>
              <div className="notification-time">
                {item.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <NavLink
        to="/student/notifications"
        className="notification-footer"
        onClick={onClose}
      >
        Show all
      </NavLink>
    </div>
  );
};

export default NotificationDropdown;
