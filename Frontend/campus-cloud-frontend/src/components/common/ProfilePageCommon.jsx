import { useEffect, useMemo, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "react-toastify";
import userService from "../../services/api/userService";

const ProfilePageCommon = ({
  initialName = "User",
  initialEmail = "",
  initialPhone = "",
  initialProfileImage = "",
  nameDisabled = true,
}) => {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [profileImage, setProfileImage] = useState(initialProfileImage);
  const [profileImageError, setProfileImageError] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: initialEmail,
    mobile: initialPhone,
    gender: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });

  const displayName = useMemo(() => {
    const first = formData.firstName || "";
    const last = formData.lastName || "";
    const full = `${first} ${last}`.trim();
    return full || initialName || "User";
  }, [formData.firstName, formData.lastName, initialName]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        setMessage(null);

        const me = await userService.getMe();
        if (!mounted) return;
        setProfile(me);

        setProfileImage(me?.profilePictureUrl || "");
        setProfileImageError(false);

        setFormData({
          firstName: me?.firstName ?? "",
          lastName: me?.lastName ?? "",
          email: me?.email ?? initialEmail,
          mobile: me?.mobile ?? initialPhone,
          gender: me?.gender ?? "",
        });
      } catch {
        if (!mounted) return;
        setError("Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [initialEmail, initialPhone, initialProfileImage]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
    setProfileImageError(false);
  };

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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const userId = profile?.userId;
    if (!userId) {
      setError("Missing userId");
      toast.error("Missing userId");
      return;
    }

    if (!formData.gender) {
      setError("Gender is required");
      toast.error("Gender is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const payload = {
        userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        gender: formData.gender,
        profilePictureUrl: profileImage,
      };

      const updated = await userService.updateUserProfile(userId, payload);
      setProfile(updated);
      setMessage("Profile updated successfully");
      toast.success("Profile updated successfully");
    } catch {
      setError("Failed to update profile");
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!profile?.username) {
      setError("Missing username");
      toast.error("Missing username");
      return;
    }

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setError("Please fill current and new password");
      toast.error("Please fill current and new password");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirm) {
      setError("New password and confirm password do not match");
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      await userService.changePassword({
        username: profile.username,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({ currentPassword: "", newPassword: "", confirm: "" });
      setMessage("Password changed successfully");
      toast.success("Password changed successfully");
    } catch {
      setError("Failed to change password");
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 text-center p-4 mb-4">
            <div className="position-relative mx-auto mb-3" style={{ width: 120 }}>
              {profileImage && !profileImageError ? (
                <img
                  src={profileImage}
                  alt="profile"
                  className="rounded-circle border"
                  width="120"
                  height="120"
                  style={{ objectFit: "cover" }}
                  onError={() => setProfileImageError(true)}
                />
              ) : (
                <div
                  className="rounded-circle border d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: 120, height: 120, backgroundColor: "#6f42c1", color: "white" }}
                >
                  <div className="fw-bold fs-1" >
                    {(formData.firstName || displayName || "U")[0]?.toUpperCase()}
                  </div>
                </div>
              )}

              <div className="profile-image-overlay" onClick={handleImageClick}>
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

            <h4 className="fw-semibold mb-1">{displayName}</h4>

  

            <form onSubmit={handleProfileSubmit} className="mt-4 text-start">
              {message ? <div className="alert alert-success py-2">{message}</div> : null}
              {error ? <div className="alert alert-danger py-2">{error}</div> : null}

              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control"
                  value={displayName}
                  disabled={nameDisabled}
                  readOnly={nameDisabled}
                />
              </div>

              {!nameDisabled ? (
                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ) : null}

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
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-semibold mb-3">Change Password</h5>

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirm"
                  className="form-control"
                  value={passwordData.confirm}
                  onChange={handlePasswordChange}
                />
              </div>

              <button type="submit" className="btn btn-outline-danger w-100">
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageCommon;
