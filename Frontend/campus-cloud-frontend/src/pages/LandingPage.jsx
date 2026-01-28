import { useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

import LoginModal from "../components/auth/LoginModal";

import SiteNavbar from "../components/common/SiteNavbar";
import SiteFooter from "../components/common/SiteFooter";
import landingHeroImg from "../assets/images/CampusCloud - Landing Page-hero_img.jpg";

const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <SiteNavbar onLoginClick={() => setShowLoginModal(true)} />

      {/* HERO SECTION */}
      <section className="hero-section" id="home">
        <div className="container">
          <div className="row align-items-center">

            {/* LEFT CONTENT */}
            <div className="col-lg-6 col-12 hero-left">
              <h1 className="hero-title">
                Elevate Your learning <br />
                Experience with <br />
                <span className="text-primary">CampusCloud</span>
              </h1>

              <p className="hero-subtitle">
                Stay organized, stay ahead. CampusCloud helps you manage
                assignments, track deadlines, and receive instant updates —
                all in one clean, easy-to-use dashboard built for students
                and faculty.
              </p>

              <button
                onClick={() => setShowLoginModal(true)}
                className="btn btn-primary btn-lg mt-3 px-4"
              >
                Get Started
              </button>
            </div>

            {/* RIGHT IMAGE */}
            <div className="col-lg-6 col-12 text-center hero-right">
              <img
                src={landingHeroImg}
                alt="CampusCloud Hero"
                className="hero-image"
              />
            </div>

          </div>
        </div>
      </section>

      {/* LOGIN MODAL */}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <SiteFooter />

    </div>
  );
};

export default LandingPage;
