import { useState } from "react";
import SiteNavbar from "../components/common/SiteNavbar";
import SiteFooter from "../components/common/SiteFooter";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: connect backend API
    console.log("Contact form submitted:", formData);

    alert("Message sent successfully!");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* NAVBAR */}
      <SiteNavbar />

      {/* MAIN CONTENT */}
      <div style={{ flex: 1 }}>
        <div className="container py-5">
      {/* ================= HEADER ================= */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Contact CampusCloud</h2>
        <p className="text-muted mt-2">
          Have questions or need help? We’re here to assist you.
        </p>
      </div>

      <div className="row g-4">
        {/* ================= CONTACT INFO ================= */}
        <div className="col-lg-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-semibold mb-4">Get in Touch</h5>

              <div className="mb-3">
                <div className="fw-medium">📍 Address</div>
                <div className="text-muted">
                  CDAC ACTS   
                  <br />
               Pune - Maharashtra
                </div>
              </div>

              <div className="mb-3">
                <div className="fw-medium">📧 Email</div>
                <div className="text-muted">support@campuscloud.com</div>
              </div>

              <div className="mb-3">
                <div className="fw-medium">📞 Phone</div>
                <div className="text-muted">+91 98765 43210</div>
              </div>

              <div className="mb-3">
                <div className="fw-medium">🕒 Working Hours</div>
                <div className="text-muted">
                  Monday – Friday  
                  <br />
                  9:00 AM – 6:00 PM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CONTACT FORM ================= */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-semibold mb-4">Send Us a Message</h5>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Write your message..."
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 text-end">
                    <button type="submit" className="btn btn-primary px-4">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
};

export default ContactPage;
