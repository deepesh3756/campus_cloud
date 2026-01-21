import { Link, NavLink } from "react-router-dom";

const SiteNavbar = ({ onLoginClick }) => {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container py-2">

        {/* Logo */}
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

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#siteNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="siteNavbar">
          <ul className="navbar-nav mx-auto gap-lg-4 mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#about">About Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#contact">Contact</a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#services">Our Services</a>
            </li>
          </ul>

          <button className="btn btn-primary" onClick={onLoginClick}>Login</button>
        </div>
      </div>
    </nav>
  );
};

export default SiteNavbar;
