import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import NotificationDropdown from "../student/NotificationDropdown";

import "./SiteNavbar.css";

const SiteNavbar = ({ onLoginClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navbarRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    setShowNotification(false);
    navigate("/");
  };

  // Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <nav 
      ref={navbarRef}
      className={`navbar navbar-expand-lg bg-white border-bottom sticky-top navbar-hide ${isVisible ? "navbar-show" : ""}`}
    >
      <div className="container py-2">
        {/* LOGO */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/"
        >
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary text-white fw-bold"
            style={{ width: 36, height: 36 }}
          >
            ☁
          </span>
          CampusCloud
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#siteNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="siteNavbar">
          {/* CENTER LINKS */}
          <ul className="navbar-nav mx-auto gap-lg-4 mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link fw-medium" to={user ? `/${user.role}` : "/"}>
                Home
              </NavLink>
            </li>

            {user?.role === "student" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link fw-medium" to="/student/assignments">
                    Assignments
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link fw-medium" to="/student/dashboard">
                    Dashboard
                  </NavLink>
                </li>
              </>
            )}

            {user?.role === "faculty" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link fw-medium" to="/faculty/dashboard">
                    Dashboard
                  </NavLink>
                </li>
              </>
            )}

            <li className="nav-item">
              <NavLink className="nav-link fw-medium" to="/about">
                About Us
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link fw-medium" to="/contact">
                Contact
              </NavLink>
            </li>

            {!user && (
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#services">
                  Our Services
                </a>
              </li>
            )}
          </ul>

          {/* RIGHT SIDE */}
          {!user ? (
            <button className="btn btn-primary" onClick={onLoginClick}>
              Login
            </button>
          ) : (
            <div className="d-flex align-items-center gap-3">
              {/* NOTIFICATIONS */}
              {user?.role === "student" && (
                <div ref={notificationRef} className="position-relative">
                  <button
                    className="btn position-relative p-2"
                    onClick={() => {
                      setShowNotification((prev) => !prev);
                      setShowDropdown(false);
                    }}
                  >
                    <i className="bi bi-bell fs-5"></i>

                    <span className="notification-badge">4</span>
                  </button>

                  {showNotification && (
                    <NotificationDropdown
                      onClose={() => setShowNotification(false)}
                    />
                  )}
                </div>
              )}

              {/* PROFILE DROPDOWN */}
              <div ref={dropdownRef} className="user-profile-dropdown">
                <button
                  className="btn p-0 border-0 bg-transparent"
                  onClick={() => {
                    setShowDropdown((prev) => !prev);
                    setShowNotification(false);
                  }}
                >
                  <div className="position-relative">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{
                        width: 38,
                        height: 38,
                        backgroundColor: "#6f42c1",
                      }}
                    >
                      {user?.name?.[0] || "U"}
                    </div>

                    <span
                      className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                      style={{ width: 10, height: 10 }}
                    />
                  </div>
                </button>

                {showDropdown && (
                  <ul className="profile-dropdown-menu">
                    <li>
                      <NavLink
                        to={`/${user.role}/profile`}
                        className="dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        Profile <i className="bi bi-person"></i>
                      </NavLink>
                    </li>

                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Logout <i className="bi bi-box-arrow-left"></i>
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SiteNavbar;
