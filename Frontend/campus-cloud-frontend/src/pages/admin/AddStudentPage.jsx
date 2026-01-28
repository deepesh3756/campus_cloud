import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const AddStudentPage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const fileInputRef = useRef(null);

  const isEdit = Boolean(studentId);

  const batches = useMemo(
    () => [
      { id: "aug-2025", name: "August-2025" },
      { id: "feb-2025", name: "February-2025" },
    ],
    []
  );

  const courses = useMemo(
    () => [
      { id: "pg-dac-aug-2025", batchId: "aug-2025", code: "PG-DAC" },
      { id: "pg-dbda-aug-2025", batchId: "aug-2025", code: "PG-DBDA" },
      { id: "pg-dac-feb-2025", batchId: "feb-2025", code: "PG-DAC" },
    ],
    []
  );

  const existingStudents = useMemo(
    () => [
      {
        id: "123456789012",
        prn: "1234567890123456",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        mobile: "9876543210",
        gender: "Male",
        batchId: "aug-2025",
        courseId: "pg-dac-aug-2025",
        status: "Active",
        password: "password",
      },
    ],
    []
  );

  const existing = isEdit ? existingStudents.find((s) => s.id === studentId) : null;

  const [prn, setPrn] = useState(existing?.prn || "");
  const [firstName, setFirstName] = useState(existing?.firstName || "");
  const [lastName, setLastName] = useState(existing?.lastName || "");
  const [email, setEmail] = useState(existing?.email || "");
  const [mobile, setMobile] = useState(existing?.mobile || "");
  const [gender, setGender] = useState(existing?.gender || "");
  const [batchId, setBatchId] = useState(existing?.batchId || "");
  const [courseId, setCourseId] = useState(existing?.courseId || "");
  const [status, setStatus] = useState(existing?.status || "Active");
  const [password, setPassword] = useState(existing?.password || "");

  const [profileImage, setProfileImage] = useState(existing?.profilePicture || "https://i.pravatar.cc/300");

  const [errors, setErrors] = useState({});

  const breadcrumbItems = useMemo(() => {
    if (isEdit) {
      return [{ label: "Students", to: "/admin/students" }, { label: "Edit Student" }];
    }

    return [{ label: "Students", to: "/admin/students" }, { label: "Add Student" }];
  }, [isEdit]);

  const courseOptions = useMemo(() => courses.filter((c) => c.batchId === batchId), [courses, batchId]);

  const effectiveCourseId = useMemo(() => {
    if (!batchId) return courseId;
    if (courseOptions.some((c) => c.id === courseId)) return courseId;
    return courseOptions[0]?.id || "";
  }, [batchId, courseId, courseOptions]);

  const validate = () => {
    const next = {};

    const p = prn.trim();
    const f = firstName.trim();
    const l = lastName.trim();
    const e = email.trim();
    const m = mobile.trim();

    if (!p) next.prn = "PRN is required";
    else if (!/^\d{16}$/.test(p)) next.prn = "PRN must be 16 digits";

    if (!f) next.firstName = "First Name is required";
    if (!l) next.lastName = "Last Name is required";

    if (!e) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) next.email = "Email is invalid";

    if (!m) next.mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(m)) next.mobile = "Mobile must be 10 digits";

    if (!gender) next.gender = "Gender is required";
    if (!batchId) next.batchId = "Batch is required";
    if (!effectiveCourseId) next.courseId = "Course is required";

    if (!status) next.status = "Status is required";

    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "Password must be at least 6 characters";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    navigate("/admin/students");
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
    <div className="add-student-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="d-flex justify-content-center">
        <div className="card border-0 shadow-sm w-100" style={{ maxWidth: 860, borderRadius: 14 }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-start justify-content-between gap-4 flex-wrap">
              <div className="flex-grow-1" style={{ minWidth: 320 }}>
                <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
                  <h4 className="fw-bold mb-0">Add New Student/ Edit Student</h4>

                  <div className="position-relative" style={{ width: 120 }}>
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

                <form onSubmit={handleSave}>
                  <div className="row g-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">PRN</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        className={`form-control ${errors.prn ? "is-invalid" : ""}`}
                        value={prn}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "");
                          setPrn(digitsOnly.slice(0, 16));
                        }}
                        placeholder="Enter 16-digit PRN"
                      />
                      {errors.prn ? <div className="invalid-feedback">{errors.prn}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <div style={{ height: 1 }} />
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
                      <label className="form-label fw-semibold">Batch</label>
                      <select
                        className={`form-select ${errors.batchId ? "is-invalid" : ""}`}
                        value={batchId}
                        onChange={(e) => {
                          setBatchId(e.target.value);
                        }}
                      >
                        <option value="">Select batch</option>
                        {batches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                      {errors.batchId ? <div className="invalid-feedback">{errors.batchId}</div> : null}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Course</label>
                      <select
                        className={`form-select ${errors.courseId ? "is-invalid" : ""}`}
                        value={effectiveCourseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        disabled={!batchId}
                      >
                        <option value="">Select course</option>
                        {courseOptions.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.code}
                          </option>
                        ))}
                      </select>
                      {errors.courseId ? <div className="invalid-feedback">{errors.courseId}</div> : null}
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
                      <div style={{ height: 1 }} />
                    </div>

                    <div className="col-12 d-flex justify-content-end gap-2 pt-2">
                      <button
                        type="button"
                        className="btn btn-light border"
                        onClick={() => navigate("/admin/students")}
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

export default AddStudentPage;
