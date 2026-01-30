import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera, Eye, EyeOff } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import authService from "../../services/api/authService";
import { toast } from "react-toastify";

const AddFacultyPage = () => {
  const navigate = useNavigate();
  const { facultyId } = useParams();

  const fileInputRef = useRef(null);

  const isEdit = Boolean(facultyId);

  const existingFaculties = useMemo(
    () => [
      {
        id: "123456789012",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        mobile: "9876543210",
        gender: "Male",
        password: "password",
        profilePicture: "https://i.pravatar.cc/300",
      },
    ],
    []
  );

  const existing = isEdit ? existingFaculties.find((f) => f.id === facultyId) : null;

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState(existing?.firstName || "");
  const [lastName, setLastName] = useState(existing?.lastName || "");
  const [email, setEmail] = useState(existing?.email || "");
  const [mobile, setMobile] = useState(existing?.mobile || "");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState(existing?.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(existing?.profilePicture || "https://i.pravatar.cc/300");

  // Track if user has manually edited username or password
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({});

  const breadcrumbItems = useMemo(() => {
    if (isEdit) {
      return [{ label: "Faculty", to: "/admin/faculty" }, { label: "Edit Faculty" }];
    }

    return [{ label: "Faculty", to: "/admin/faculty" }, { label: "Add Faculty" }];
  }, [isEdit]);

  const validate = () => {
    const next = {};

    const u = username.trim();
    const f = firstName.trim();
    const l = lastName.trim();
    const e = email.trim();
    const m = mobile.trim();

    if (!u) next.username = "Username is required";

    if (!f) next.firstName = "First Name is required";
    if (!l) next.lastName = "Last Name is required";

    if (!e) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) next.email = "Email is invalid";

    if (!m) next.mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(m)) next.mobile = "Mobile must be 10 digits";

    if (!gender) next.gender = "Gender is required";

    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "Password must be at least 6 characters";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Handler for email field - auto-updates username if not manually touched
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Auto-fill username if user hasn't manually edited it
    if (!usernameTouched) {
      setUsername(newEmail);
    }
  };

  // Handler for mobile field - auto-updates password if not manually touched
  const handleMobileChange = (e) => {
    const newMobile = e.target.value;
    setMobile(newMobile);
    
    // Auto-fill password if user hasn't manually edited it
    if (!passwordTouched) {
      setPassword(newMobile);
    }
  };

  // Handler for username field - marks it as manually touched
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameTouched(true);
  };

  // Handler for password field - marks it as manually touched
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordTouched(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit) {
      toast.error("Edit Faculty is not supported yet. Please register a new faculty.", { autoClose: 3500 });
      return;
    }

    setSaving(true);
    try {
      await authService.registerFaculty({
        username: username.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        gender: String(gender).toUpperCase(),
        profilePictureUrl: profileImage,
      });

      toast.success("Faculty registered successfully", { autoClose: 2500 });

      setUsername("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setMobile("");
      setGender("");
      setPassword("");
      setShowPassword(false);
      setProfileImage("https://i.pravatar.cc/300");
      setErrors({});
      setUsernameTouched(false);
      setPasswordTouched(false);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Failed to register faculty";
      toast.error(message, { autoClose: 3500 });
    } finally {
      setSaving(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
  };

  return (
    <div className="add-faculty-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="d-flex justify-content-center">
        <div className="card border-0 shadow-sm w-100" style={{ maxWidth: 860, borderRadius: 14 }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-start justify-content-between gap-4 flex-wrap">
              <div className="flex-grow-1" style={{ minWidth: 320 }}>
                <h4 className="fw-bold mb-4">Add New Faculty/ Edit Faculty</h4>

                <form onSubmit={handleSave}>
                  <div className="row g-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Username</label>
                      <input
                        type="text"
                        className={`form-control ${errors.username ? "is-invalid" : ""}`}
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="faculty_test_01"
                        disabled={saving}
                      />
                      {errors.username ? <div className="invalid-feedback">{errors.username}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="position-relative mx-auto mb-3" style={{ width: 120 }}>
                        <img
                          src={profileImage}
                          alt="profile"
                          className="rounded-circle border"
                          width="120"
                          height="120"
                          style={{ objectFit: "cover" }}
                        />

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
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">First Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter first name"
                        disabled={saving}
                      />
                      {errors.firstName ? <div className="invalid-feedback">{errors.firstName}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Last Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                        disabled={saving}
                      />
                      {errors.lastName ? <div className="invalid-feedback">{errors.lastName}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Email</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter email"
                        disabled={saving}
                      />
                      {errors.email ? <div className="invalid-feedback">{errors.email}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Mobile</label>
                      <input
                        type="text"
                        className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                        value={mobile}
                        onChange={handleMobileChange}
                        placeholder="Enter mobile number"
                        disabled={saving}
                      />
                      {errors.mobile ? <div className="invalid-feedback">{errors.mobile}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Gender</label>
                      <select
                        className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        disabled={saving}
                      >
                        <option value="">Select gender</option>
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                      {errors.gender ? <div className="invalid-feedback">{errors.gender}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Password</label>
                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control ${errors.password ? "is-invalid" : ""}`}
                          value={password}
                          onChange={handlePasswordChange}
                          placeholder="Enter password"
                          style={{ paddingRight: 40 }}
                          disabled={saving}
                        />
                        <button
                          type="button"
                          className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ padding: "0 10px", zIndex: 5 }}
                          disabled={saving}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password ? <div className="invalid-feedback d-block">{errors.password}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <div style={{ height: 1 }} />
                    </div>

                    <div className="col-12 d-flex justify-content-end gap-2 pt-2">
                      <button
                        type="button"
                        className="btn btn-light border"
                        onClick={() => navigate("/admin/faculty")}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" style={{ minWidth: 120 }}>
                        {saving ? "Saving..." : "Save"}
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
  );
};

export default AddFacultyPage;
