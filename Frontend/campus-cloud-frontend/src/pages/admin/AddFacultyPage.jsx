import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Camera, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import authService from "../../services/api/authService";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import userService from "../../services/api/userService";
import academicService from "../../services/api/academicService";

const AddFacultyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { facultyId } = useParams();

  const fileInputRef = useRef(null);

  const parsedFacultyUserId = useMemo(() => {
    const n = Number(facultyId);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [facultyId]);

  const shouldAutoOpenAdd = useMemo(() => {
    return location?.pathname?.endsWith("/faculty/manage/new");
  }, [location?.pathname]);

  const shouldAutoOpenEdit = useMemo(() => {
    return Boolean(location?.pathname?.includes("/faculty/manage/")) && Boolean(location?.pathname?.endsWith("/edit")) && Boolean(parsedFacultyUserId);
  }, [location?.pathname, parsedFacultyUserId]);

  const [faculties, setFaculties] = useState([]);
  const [coursesByFacultyId, setCoursesByFacultyId] = useState({});
  const [loading, setLoading] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const isEditMode = Boolean(editingUserId);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/300");

  // Track if user has manually edited username or password
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({});

  const breadcrumbItems = useMemo(() => {
    return [{ label: "Faculty", to: "/admin/faculty" }, { label: "Manage Faculty", to: "/admin/faculty/manage" }];
  }, []);

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

    if (!isEditMode) {
      if (!password) next.password = "Password is required";
      else if (password.length < 6) next.password = "Password must be at least 6 characters";
    }

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
    
    // Auto-fill password if user hasn't manually edited it (add only)
    if (!isEditMode && !passwordTouched) {
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

    setSaving(true);
    try {
      if (isEditMode) {
        await userService.updateUserProfile(editingUserId, {
          username: username.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          gender: String(gender).toUpperCase(),
          profilePictureUrl: profileImage,
        });
        toast.success("Faculty updated successfully", { autoClose: 2500 });
      } else {
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
      }

      await refreshFacultyList();
      closeForm();
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || (isEditMode ? "Failed to update faculty" : "Failed to register faculty");
      toast.error(message, { autoClose: 3500 });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingUserId(null);
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
  };

  const closeForm = () => {
    if (saving) return;
    setIsFormOpen(false);
    resetForm();
    navigate("/admin/faculty/manage", { replace: true });
  };

  const openAddForm = () => {
    resetForm();
    setIsFormOpen(true);
    setEditingUserId(null);
    navigate("/admin/faculty/manage/new", { replace: true });
  };

  const openEditForm = async (userId) => {
    if (!userId) return;
    resetForm();
    setIsFormOpen(true);
    setEditingUserId(userId);
    navigate(`/admin/faculty/manage/${userId}/edit`, { replace: true });
    setSaving(true);
    try {
      const p = await userService.getUserProfile(userId);
      setUsername(p?.username || "");
      setFirstName(p?.firstName || "");
      setLastName(p?.lastName || "");
      setEmail(p?.email || "");
      setMobile(p?.mobile || "");
      setGender(p?.gender ? String(p.gender).toUpperCase() : "");
      setProfileImage(p?.profilePictureUrl || "https://i.pravatar.cc/300");
      setUsernameTouched(true);
      setPasswordTouched(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to load faculty profile", { autoClose: 3500 });
      setIsFormOpen(false);
      setEditingUserId(null);
    } finally {
      setSaving(false);
    }
  };

  const refreshFacultyList = async () => {
    setLoading(true);
    try {
      const data = await userService.getFaculties();
      const list = (Array.isArray(data) ? data : []).filter((u) => String(u.status).toUpperCase() === "ACTIVE");
      setFaculties(list);

      const nextCourses = {};
      await Promise.all(
        list.map(async (f) => {
          try {
            const assignments = await academicService.getSubjectsByFaculty(f.userId);
            const courseSet = new Set(
              (Array.isArray(assignments) ? assignments : [])
                .map((a) => a.courseCode)
                .filter(Boolean)
            );
            nextCourses[f.userId] = Array.from(courseSet).join(", ");
          } catch {
            nextCourses[f.userId] = "";
          }
        })
      );
      setCoursesByFacultyId(nextCourses);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to load faculties", { autoClose: 3500 });
      setFaculties([]);
      setCoursesByFacultyId({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFacultyList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shouldAutoOpenAdd) {
      openAddForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoOpenAdd]);

  useEffect(() => {
    if (shouldAutoOpenEdit && parsedFacultyUserId) {
      openEditForm(parsedFacultyUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoOpenEdit, parsedFacultyUserId]);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await userService.updateUserStatus(deleteTarget.userId, "INACTIVE");
      toast.success("Faculty marked as INACTIVE", { autoClose: 2500 });
      setDeleteTarget(null);
      await refreshFacultyList();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete faculty", { autoClose: 3500 });
    } finally {
      setDeleting(false);
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

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Faculty"
        message="Are you sure you want to delete this faculty? This will mark the faculty as INACTIVE."
        confirmText="Yes, Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={isEditMode ? "Edit Faculty" : "Add New Faculty"}
      >
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

            {!isEditMode ? (
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
            ) : (
              <div className="col-12 col-md-6">
                <div style={{ height: 1 }} />
              </div>
            )}

            <div className="col-12 d-flex justify-content-end gap-2 pt-2">
              <button type="button" className="btn btn-light border" onClick={closeForm} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ minWidth: 120 }}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
            <h4 className="fw-bold mb-0">Faculty List</h4>
            <button type="button" className="btn btn-primary" onClick={openAddForm}>
              Add New Faculty
            </button>
          </div>

          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3 text-center" style={{ width: 80 }}>
                    S.no
                  </th>
                  <th className="px-4 py-3 text-center" style={{ width: 170 }}>
                    Faculty Code
                  </th>
                  <th className="px-4 py-3 text-center" style={{ width: 220 }}>
                    Full Name
                  </th>
                  <th className="px-4 py-3 text-center" style={{ minWidth: 240 }}>
                    Email
                  </th>
                  <th className="px-4 py-3 text-center" style={{ width: 170 }}>
                    Mobile
                  </th>
                  <th className="px-4 py-3 text-center" style={{ minWidth: 240 }}>
                    Courses
                  </th>
                  <th className="px-4 py-3 text-center" style={{ width: 140 }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={7}>
                      Loading...
                    </td>
                  </tr>
                ) : null}

                {!loading
                  ? faculties.map((f, idx) => (
                      <tr key={f.userId}>
                        <td className="px-4 py-3 text-secondary text-center">{idx + 1}</td>
                        <td className="px-4 py-3 text-center">{f.userId}</td>
                        <td className="px-4 py-3 text-secondary text-center">
                          {[f.firstName, f.lastName].filter(Boolean).join(" ")}
                        </td>
                        <td className="px-4 py-3 text-secondary text-center">{f.email}</td>
                        <td className="px-4 py-3 text-secondary text-center">{f.mobile}</td>
                        <td className="px-4 py-3 text-secondary text-center">{coursesByFacultyId[f.userId] || "-"}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="d-inline-flex align-items-center justify-content-center gap-3">
                            <button
                              type="button"
                              className="btn btn-sm btn-link p-0 text-secondary"
                              onClick={() => openEditForm(f.userId)}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-link p-0 text-danger"
                              onClick={() => setDeleteTarget(f)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}

                {!loading && !faculties.length ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={7}>
                      No active faculties found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFacultyPage;
