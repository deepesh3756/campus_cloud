import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const AddFacultyPage = () => {
  const navigate = useNavigate();
  const { facultyId } = useParams();

  const fileInputRef = useRef(null);

  const isEdit = Boolean(facultyId);

  const existingFaculties = useMemo(
    () => [
      {
        id: "123456789012",
        facultyCode: "FAC0025",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        mobile: "9876543210",
        gender: "Male",
        status: "Active",
        password: "password",
        profilePicture: "https://i.pravatar.cc/300",
      },
    ],
    []
  );

  const existing = isEdit ? existingFaculties.find((f) => f.id === facultyId) : null;

  const [facultyCode, setFacultyCode] = useState(existing?.facultyCode || "");
  const [firstName, setFirstName] = useState(existing?.firstName || "");
  const [lastName, setLastName] = useState(existing?.lastName || "");
  const [email, setEmail] = useState(existing?.email || "");
  const [mobile, setMobile] = useState(existing?.mobile || "");
  const [gender, setGender] = useState(existing?.gender || "");
  const [status, setStatus] = useState(existing?.status || "");
  const [password, setPassword] = useState(existing?.password || "");
  const [profileImage, setProfileImage] = useState(existing?.profilePicture || "https://i.pravatar.cc/300");

  const [errors, setErrors] = useState({});

  const breadcrumbItems = useMemo(() => {
    if (isEdit) {
      return [{ label: "Faculty", to: "/admin/faculty" }, { label: "Edit Faculty" }];
    }

    return [{ label: "Faculty", to: "/admin/faculty" }, { label: "Add Faculty" }];
  }, [isEdit]);

  const validate = () => {
    const next = {};

    const code = facultyCode.trim();
    const f = firstName.trim();
    const l = lastName.trim();
    const e = email.trim();
    const m = mobile.trim();

    if (!code) next.facultyCode = "Faculty ID is required";

    if (!f) next.firstName = "First Name is required";
    if (!l) next.lastName = "Last Name is required";

    if (!e) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) next.email = "Email is invalid";

    if (!m) next.mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(m)) next.mobile = "Mobile must be 10 digits";

    if (!gender) next.gender = "Gender is required";
    if (!status) next.status = "Status is required";

    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "Password must be at least 6 characters";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    navigate("/admin/faculty");
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
                      <label className="form-label fw-semibold">Faculty ID</label>
                      <input
                        type="text"
                        className={`form-control ${errors.facultyCode ? "is-invalid" : ""}`}
                        value={facultyCode}
                        onChange={(e) => setFacultyCode(e.target.value)}
                        placeholder="Enter faculty ID"
                      />
                      {errors.facultyCode ? <div className="invalid-feedback">{errors.facultyCode}</div> : null}
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
                      />
                      {errors.lastName ? <div className="invalid-feedback">{errors.lastName}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Email</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                      />
                      {errors.email ? <div className="invalid-feedback">{errors.email}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Mobile</label>
                      <input
                        type="text"
                        className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Enter mobile number"
                      />
                      {errors.mobile ? <div className="invalid-feedback">{errors.mobile}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Gender</label>
                      <select
                        className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender ? <div className="invalid-feedback">{errors.gender}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Password</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                      />
                      {errors.password ? <div className="invalid-feedback">{errors.password}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Status</label>
                      <select
                        className={`form-select ${errors.status ? "is-invalid" : ""}`}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="">Select status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      {errors.status ? <div className="invalid-feedback">{errors.status}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <div style={{ height: 1 }} />
                    </div>

                    <div className="col-12 d-flex justify-content-end gap-2 pt-2">
                      <button
                        type="button"
                        className="btn btn-light border"
                        onClick={() => navigate("/admin/faculty")}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" style={{ minWidth: 120 }}>
                        Save
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
