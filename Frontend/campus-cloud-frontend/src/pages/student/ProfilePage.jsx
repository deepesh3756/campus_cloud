import { useRef, useState } from "react";
import { Camera } from "lucide-react";

const ProfilePage = () => {
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/300"
  );

  const [formData, setFormData] = useState({
    name: "Mohit Gupta",
    email: "alice.johnson@campuscloud.edu",
    phone: "+91 9876543210",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  /* ===============================
     PROFILE IMAGE HANDLER
  =============================== */
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);

    // TODO:
    // upload image to backend
  };

  /* ===============================
     FORM HANDLERS
  =============================== */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log("Updated profile:", formData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    console.log("Password update:", passwordData);
  };

  return (
    <div className="container py-5">

      {/* ================= PROFILE CARD ================= */}
      <div className="row justify-content-center">
        <div className="col-md-6">

          <div className="card shadow-sm border-0 text-center p-4 mb-4">

            {/* PROFILE IMAGE */}
            <div className="position-relative mx-auto mb-3" style={{ width: 120 }}>
              <img
                src={profileImage}
                alt="profile"
                className="rounded-circle border"
                width="120"
                height="120"
                style={{ objectFit: "cover" }}
              />

              {/* CAMERA OVERLAY */}
              <div
                className="profile-image-overlay"
                onClick={handleImageClick}
              >
                <Camera size={28} />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <h4 className="fw-semibold mb-1">{formData.name}</h4>

            <span className="badge bg-success-subtle text-success">
              Online
            </span>

            <form onSubmit={handleProfileSubmit} className="mt-4 text-start">

              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control"
                  value={formData.name}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Mobile Number</label>
                <input
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Save Changes
              </button>
            </form>
          </div>

          {/* ================= PASSWORD CARD ================= */}
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-semibold mb-3">Change Password</h5>

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="current"
                  className="form-control"
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="new"
                  className="form-control"
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirm"
                  className="form-control"
                  onChange={handlePasswordChange}
                />
              </div>

              <button type="submit" className="btn btn-outline-danger w-100">
                Change Password
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
