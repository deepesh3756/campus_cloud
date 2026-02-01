import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api/axios.config";
import "./NotificationDropdown.css";

const formatNotificationTime = (createdAt) => {
  if (!createdAt) return "";
  const dt = new Date(createdAt);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleString();
};

const formatDisplayDateTime = (value) => {
  if (!value) return "";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "";

  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yy = String(dt.getFullYear()).slice(-2);
  const HH = String(dt.getHours()).padStart(2, "0");
  const MM = String(dt.getMinutes()).padStart(2, "0");

  return `${dd}-${mm}-${yy} ${HH}:${MM}`;
};

const parseNotificationMessage = (message) => {
  const raw = typeof message === "string" ? message : "";
  const parts = raw.split(";").map((p) => p.trim()).filter(Boolean);

  if (parts.length >= 4) {
    return {
      typeLabel: parts[0],
      title: parts[1],
      subject: parts[2],
      dueDate: parts[3],
      isStructured: true,
    };
  }

  return {
    typeLabel: null,
    title: raw,
    subject: null,
    dueDate: null,
    isStructured: false,
  };
};

const NotificationDropdown = ({ onClose, onNotificationsUpdated }) => {
  const { user } = useAuth();
  const userId = user?.userId;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const hasUnread = useMemo(() => {
    return (notifications || []).some((n) => !n?.isRead);
  }, [notifications]);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/notifications/user/${userId}`);
        const payload = response.data?.data ?? response.data;
        if (!mounted) return;
        setNotifications(Array.isArray(payload) ? payload : []);
      } catch {
        if (!mounted) return;
        setNotifications([]);
        toast.error("Failed to load notifications");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const markSingleAsRead = async (notificationId) => {
    if (!notificationId) return;

    const existing = (notifications || []).find((n) => n?.id === notificationId);
    if (existing?.isRead) return;

    setNotifications((prev) =>
      (prev || []).map((n) =>
        n?.id === notificationId
          ? {
              ...n,
              isRead: true,
              readAt: n?.readAt ?? new Date().toISOString(),
            }
          : n
      )
    );

    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      onNotificationsUpdated?.();
    } catch {
      setNotifications((prev) =>
        (prev || []).map((n) =>
          n?.id === notificationId
            ? {
                ...n,
                isRead: false,
              }
            : n
        )
      );
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    if (!hasUnread) return;

    setMarkingAll(true);
    const previous = notifications;

    setNotifications((prev) =>
      (prev || []).map((n) =>
        n?.isRead
          ? n
          : {
              ...n,
              isRead: true,
              readAt: n?.readAt ?? new Date().toISOString(),
            }
      )
    );

    try {
      await api.put(`/api/notifications/user/${userId}/read-all`);
      onNotificationsUpdated?.();
    } catch {
      setNotifications(previous);
      toast.error("Failed to mark all notifications as read");
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="notification-box">

      {/* HEADER */}
      <div className="notification-header">
        <span>Notifications</span>
        <button
          className="mark-read-btn"
          type="button"
          onClick={markAllAsRead}
          disabled={!userId || !hasUnread || loading || markingAll}
        >
          <i className="bi bi-check2-all"></i>
          Mark all as read
        </button>
      </div>

      {/* LIST */}
      <div className="notification-list">
        {loading ? (
          <div className="notification-item">
            <div className="notification-content">
              <div className="notification-title">Loading...</div>
            </div>
          </div>
        ) : (notifications || []).length === 0 ? (
          <div className="notification-item">
            <div className="notification-content">
              <div className="notification-title">No notifications</div>
            </div>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`notification-item ${
                !item.isRead ? "unread" : ""
              }`}
            >
              <div className="notification-icon">
                <i className="bi bi-bell-fill"></i>
              </div>

              <div className="notification-content">
                {(() => {
                  const parsed = parseNotificationMessage(item.message);
                  const title = parsed.title || item.title || "Notification";
                  const subject = parsed.subject;
                  const dueDateRaw = parsed.dueDate;
                  const typeLabel = parsed.typeLabel || item.type;

                  const dueDateFormatted = (() => {
                    if (!dueDateRaw) return "";
                    const formatted = formatDisplayDateTime(dueDateRaw);
                    return formatted || dueDateRaw;
                  })();

                  return (
                    <>
                      <div className="notification-main-title">{title}</div>

                      {subject || dueDateRaw ? (
                        <div className="notification-meta-row">
                          <div className="notification-subject">{subject || ""}</div>
                          <div className="notification-due">{dueDateFormatted ? `Due date: ${dueDateFormatted}` : ""}</div>
                        </div>
                      ) : null}

                      {typeLabel || !item.isRead ? (
                        <div className="notification-bottom-row">
                          <div className="notification-bottom-left">
                            {typeLabel ? (
                              <div className="notification-type-badge">{typeLabel}</div>
                            ) : null}
                          </div>

                          <div className="notification-bottom-right">
                            {!item.isRead ? (
                              <button
                                type="button"
                                className="notification-mark-read"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  markSingleAsRead(item.id);
                                }}
                              >
                                Mark as read
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </>
                  );
                })()}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default NotificationDropdown;
