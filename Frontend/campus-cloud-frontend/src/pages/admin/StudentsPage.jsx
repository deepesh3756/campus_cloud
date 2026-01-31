import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FileUp, Plus, Pencil, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import Modal from "../../components/common/Modal";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import academicService from "../../services/api/academicService";
import authService from "../../services/api/authService";
import userService from "../../services/api/userService";
import { toast } from "react-toastify";

const StudentsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const BATCH_STORAGE_KEY = "admin_students_selectedBatchId";
  const COURSE_STORAGE_KEY = "admin_students_selectedBatchCourseId";

  const [selectedBatchId, setSelectedBatchId] = useState(() => {
    try {
      return localStorage.getItem(BATCH_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });

  const [selectedBatchCourseId, setSelectedBatchCourseId] = useState(() => {
    try {
      return localStorage.getItem(COURSE_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });

  const [batches, setBatches] = useState([]);
  const [batchCourses, setBatchCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [activeUserId, setActiveUserId] = useState(null);

  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [prn, setPrn] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [password, setPassword] = useState("");

  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [usernameCheck, setUsernameCheck] = useState({ status: "idle", available: null, message: "" });
  const [savingStudent, setSavingStudent] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const selectedBatch = useMemo(
    () => batches.find((b) => String(b.batchId) === String(selectedBatchId)) || null,
    [batches, selectedBatchId]
  );

  const courseOptions = useMemo(
    () => (Array.isArray(batchCourses) ? batchCourses : []),
    [batchCourses]
  );

  const effectiveBatchCourseId = useMemo(() => {
    const list = Array.isArray(courseOptions) ? courseOptions : [];
    if (!list.length) return "";
    if (list.some((c) => String(c.batchCourseId) === String(selectedBatchCourseId))) {
      return String(selectedBatchCourseId);
    }
    return String(list[0].batchCourseId);
  }, [courseOptions, selectedBatchCourseId]);

  const selectedCourse = useMemo(
    () => courseOptions.find((c) => String(c.batchCourseId) === String(effectiveBatchCourseId)) || null,
    [courseOptions, effectiveBatchCourseId]
  );

  useEffect(() => {
    try {
      if (selectedBatchId) localStorage.setItem(BATCH_STORAGE_KEY, String(selectedBatchId));
    } catch {
      // ignore
    }
  }, [selectedBatchId]);

  useEffect(() => {
    try {
      if (effectiveBatchCourseId) localStorage.setItem(COURSE_STORAGE_KEY, String(effectiveBatchCourseId));
    } catch {
      // ignore
    }
  }, [effectiveBatchCourseId]);

  useEffect(() => {
    let isMounted = true;
    const fetchBatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await academicService.getBatches();
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : [];
        setBatches(list);
        if (!list.length) return;

        setSelectedBatchId((prev) => {
          const prevValue = String(prev || "");
          const stillExists = list.some((b) => String(b.batchId) === prevValue);
          if (prevValue && stillExists) return prevValue;
          return String(list[0].batchId);
        });
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load batches");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBatches();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedBatchId) return;
    let isMounted = true;

    const fetchCoursesForBatch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await academicService.getCoursesByBatch(selectedBatchId);
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : [];
        setBatchCourses(list);
        setSelectedBatchCourseId((prev) => {
          const prevValue = String(prev || "");
          const stillExists = list.some((c) => String(c.batchCourseId) === prevValue);
          if (prevValue && stillExists) return prevValue;
          return String(list[0]?.batchCourseId || "");
        });
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load courses");
        setBatchCourses([]);
        setSelectedBatchCourseId("");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCoursesForBatch();
    return () => {
      isMounted = false;
    };
  }, [selectedBatchId]);

  const refreshStudents = async () => {
    if (!effectiveBatchCourseId) {
      setStudents([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userIds = await academicService.getEnrolledStudentIds(effectiveBatchCourseId);
      const ids = Array.isArray(userIds) ? userIds : [];
      if (!ids.length) {
        setStudents([]);
        return;
      }

      const users = await userService.getUsersByIds(ids);
      setStudents(Array.isArray(users) ? users : []);
    } catch (err) {
      setError(err?.message || "Failed to load students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveBatchCourseId]);

  useEffect(() => {
    const editUserId = location.state?.editUserId;
    if (!editUserId) return;
    (async () => {
      try {
        await openEditModal(editUserId);
      } finally {
        navigate(location.pathname, { replace: true, state: {} });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.editUserId]);

  useEffect(() => {
    const openAddStudent = location.state?.openAddStudent;
    if (!openAddStudent) return;
    try {
      openAddModal();
    } finally {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.openAddStudent]);

  const breadcrumbItems = selectedBatch
    ? selectedCourse
      ? [
          { label: "Students", to: "/admin/students" },
          { label: selectedBatch.batchName },
          { label: selectedCourse.courseCode },
        ]
      : [{ label: "Students", to: "/admin/students" }, { label: selectedBatch.batchName }]
    : [{ label: "Students" }];

  const resetStudentForm = () => {
    setActiveUserId(null);
    setUsername("");
    setOriginalUsername("");
    setPrn("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setGender("");
    setProfilePictureUrl("");
    setPassword("");
    setUsernameTouched(false);
    setPasswordTouched(false);
    setUsernameCheck({ status: "idle", available: null, message: "" });
    setFormErrors({});
  };

  const openAddModal = () => {
    setModalMode("add");
    resetStudentForm();
    setIsStudentModalOpen(true);
  };

  const openEditModal = async (userId) => {
    setModalMode("edit");
    resetStudentForm();
    setIsStudentModalOpen(true);
    setSavingStudent(true);
    try {
      const profile = await userService.getUserProfile(userId);
      setActiveUserId(profile?.userId ?? userId);
      setUsername(profile?.username || "");
      setOriginalUsername(profile?.username || "");
      setPrn(profile?.prn || "");
      setFirstName(profile?.firstName || "");
      setLastName(profile?.lastName || "");
      setEmail(profile?.email || "");
      setMobile(profile?.mobile || "");
      setGender(profile?.gender || "");
      setProfilePictureUrl(profile?.profilePictureUrl || "");
      setUsernameCheck({ status: "idle", available: true, message: "" });
    } catch (err) {
      toast.error(err?.message || "Failed to load student details", { autoClose: 3500 });
      setIsStudentModalOpen(false);
    } finally {
      setSavingStudent(false);
    }
  };

  const closeStudentModal = () => {
    if (savingStudent) return;
    setIsStudentModalOpen(false);
    resetStudentForm();
  };

  const validateStudentForm = () => {
    const next = {};
    const u = String(username || "").trim();
    const p = String(prn || "").trim();
    const f = String(firstName || "").trim();
    const l = String(lastName || "").trim();

    if (!u) next.username = "Username is required";
    if (!p) next.prn = "PRN is required";
    if (!f) next.firstName = "First Name is required";
    if (!l) next.lastName = "Last Name is required";
    if (!gender) next.gender = "Gender is required";

    if (modalMode === "add") {
      if (!password) next.password = "Password is required";
      else if (String(password).length < 6) next.password = "Password must be at least 6 characters";
    }

    if (usernameCheck.status === "checking") next.username = "Checking username...";
    if (usernameCheck.available === false) next.username = "Username is not available";

    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePrnChange = (e) => {
    const next = e.target.value;
    setPrn(next);
    if (!usernameTouched) setUsername(next);
    if (!passwordTouched) setPassword(next);
    setFormErrors((prev) => {
      if (!prev.prn && !prev.username && !prev.password) return prev;
      const copy = { ...prev };
      delete copy.prn;
      delete copy.username;
      delete copy.password;
      return copy;
    });
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameTouched(true);
    setUsernameCheck({ status: "idle", available: null, message: "" });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordTouched(true);
  };

  const checkUsername = async () => {
    const u = String(username || "").trim();
    if (!u) return;

    if (modalMode === "edit" && u === String(originalUsername || "").trim()) {
      return;
    }

    setUsernameCheck({ status: "checking", available: null, message: "" });
    try {
      const available = await userService.checkUsernameAvailable(u);
      setUsernameCheck({
        status: "done",
        available: Boolean(available),
        message: Boolean(available) ? "Username is available" : "Username is not available",
      });
    } catch (err) {
      setUsernameCheck({ status: "error", available: null, message: "Failed to check username" });
    }
  };

  const ensureUsernameChecked = async () => {
    const u = String(username || "").trim();
    if (!u) return false;

    const isUnchangedEdit = modalMode === "edit" && u === String(originalUsername || "").trim();
    if (isUnchangedEdit) return true;

    if (usernameCheck.status === "done" && usernameCheck.available === true) return true;

    setUsernameCheck({ status: "checking", available: null, message: "" });
    try {
      const available = await userService.checkUsernameAvailable(u);
      const ok = Boolean(available);
      setUsernameCheck({
        status: "done",
        available: ok,
        message: ok ? "Username is available" : "Username is not available",
      });
      return ok;
    } catch {
      setUsernameCheck({ status: "error", available: null, message: "Failed to check username" });
      return false;
    }
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();

    const usernameOk = await ensureUsernameChecked();
    if (!usernameOk) {
      setFormErrors((prev) => ({ ...prev, username: "Username is not available" }));
      return;
    }

    if (!validateStudentForm()) return;
    if (!selectedBatch || !selectedCourse) {
      toast.error("Please select batch and course", { autoClose: 3500 });
      return;
    }

    setSavingStudent(true);
    try {
      if (modalMode === "add") {
        const created = await authService.registerStudent({
          username: String(username).trim(),
          password,
          prn: String(prn).trim(),
          firstName: String(firstName).trim(),
          lastName: String(lastName).trim(),
          email: String(email).trim(),
          mobile: String(mobile).trim(),
          gender: String(gender).toUpperCase(),
          profilePictureUrl: profilePictureUrl || null,
        });

        const userId = created?.userId;
        if (!userId) {
          throw new Error("Student created but userId not returned by backend");
        }

        try {
          await academicService.enrollStudent({
            userId,
            batchId: Number(selectedBatch.batchId),
            courseId: Number(selectedCourse.courseId),
          });
        } catch (enrollErr) {
          try {
            await userService.updateUserStatus(userId, "INACTIVE");
          } catch {
            // ignore rollback failure
          }
          throw enrollErr;
        }

        toast.success("Student created and enrolled successfully", { autoClose: 2500 });
      } else {
        if (!activeUserId) throw new Error("Missing userId for update");

        await userService.updateUserProfile(activeUserId, {
          username: String(username).trim(),
          firstName: String(firstName).trim(),
          lastName: String(lastName).trim(),
          email: String(email).trim(),
          mobile: String(mobile).trim(),
          gender: String(gender).toUpperCase(),
          profilePictureUrl: profilePictureUrl || null,
        });

        toast.success("Student updated successfully", { autoClose: 2500 });
      }

      closeStudentModal();
      await refreshStudents();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to save student", { autoClose: 3500 });
    } finally {
      setSavingStudent(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.userId) return;
    setDeleting(true);
    try {
      await userService.updateUserStatus(deleteTarget.userId, "INACTIVE");
      toast.success("Student deleted successfully", { autoClose: 2500 });
      setDeleteTarget(null);
      await refreshStudents();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete student", { autoClose: 3500 });
    } finally {
      setDeleting(false);
    }
  };

  const handleImportCsv = () => {
    window.alert("CSV import is not implemented yet.");
  };

  return (
    <div className="students-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Student"
        message={deleteTarget ? `Are you sure you want to delete ${deleteTarget.prn || "this student"}?` : "Are you sure you want to delete?"}
        loading={deleting}
        onCancel={() => (deleting ? null : setDeleteTarget(null))}
        onConfirm={handleConfirmDelete}
      />

      <Modal
        isOpen={isStudentModalOpen}
        onClose={closeStudentModal}
        title={modalMode === "add" ? "Add Student" : "Edit Student"}
      >
        <form onSubmit={handleSaveStudent}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">PRN *</label>
              <input
                type="text"
                className={`form-control ${formErrors.prn ? "is-invalid" : ""}`}
                value={prn}
                onChange={handlePrnChange}
                disabled={modalMode === "edit"}
              />
              {formErrors.prn ? <div className="invalid-feedback">{formErrors.prn}</div> : null}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Username *</label>
              <input
                type="text"
                className={`form-control ${formErrors.username ? "is-invalid" : ""}`}
                value={username}
                onChange={handleUsernameChange}
                onBlur={checkUsername}
                disabled={savingStudent}
              />
              {formErrors.username ? <div className="invalid-feedback">{formErrors.username}</div> : null}
              {!formErrors.username && usernameCheck.status === "done" ? (
                <div className={`small mt-1 ${usernameCheck.available ? "text-success" : "text-danger"}`}>
                  {usernameCheck.message}
                </div>
              ) : null}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">First Name *</label>
              <input
                type="text"
                className={`form-control ${formErrors.firstName ? "is-invalid" : ""}`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={savingStudent}
              />
              {formErrors.firstName ? <div className="invalid-feedback">{formErrors.firstName}</div> : null}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Last Name *</label>
              <input
                type="text"
                className={`form-control ${formErrors.lastName ? "is-invalid" : ""}`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={savingStudent}
              />
              {formErrors.lastName ? <div className="invalid-feedback">{formErrors.lastName}</div> : null}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={savingStudent}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Mobile</label>
              <input
                type="text"
                className="form-control"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={savingStudent}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Gender *</label>
              <select
                className={`form-select ${formErrors.gender ? "is-invalid" : ""}`}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={savingStudent}
              >
                <option value="">Select gender</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
              {formErrors.gender ? <div className="invalid-feedback">{formErrors.gender}</div> : null}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Profile Picture URL</label>
              <input
                type="text"
                className="form-control"
                value={profilePictureUrl}
                onChange={(e) => setProfilePictureUrl(e.target.value)}
                disabled={savingStudent}
              />
            </div>

            {modalMode === "add" ? (
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Password *</label>
                <input
                  type="text"
                  className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={savingStudent}
                />
                {formErrors.password ? <div className="invalid-feedback">{formErrors.password}</div> : null}
              </div>
            ) : null}
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-light border" onClick={closeStudentModal} disabled={savingStudent}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={savingStudent}>
              {savingStudent ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <h4 className="fw-bold mb-0">Student List</h4>

              <div className="d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                <span className="text-secondary">Batch</span>
                <select
                  className="form-select"
                  style={{ width: 170 }}
                  value={selectedBatchId}
                  onChange={(e) => {
                    setSelectedBatchId(e.target.value);
                    setSelectedBatchCourseId("");
                  }}
                >
                  {batches.map((b) => (
                    <option key={b.batchId} value={b.batchId}>
                      {b.batchName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                <span className="text-secondary">Course</span>
                <select
                  className="form-select"
                  style={{ width: 150 }}
                  value={effectiveBatchCourseId}
                  onChange={(e) => setSelectedBatchCourseId(e.target.value)}
                  disabled={!courseOptions.length}
                >
                  {courseOptions.map((c) => (
                    <option key={c.batchCourseId} value={c.batchCourseId}>
                      {c.courseCode}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                onClick={openAddModal}
                disabled={!selectedBatch || !selectedCourse}
              >
                <Plus size={18} />
                Add Student
              </button>
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                onClick={handleImportCsv}
              >
                <FileUp size={18} />
                Import from csv
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 80 }}>
                    S.no
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 170 }}>
                    PRN (12 digits)
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 200 }}>
                    Student Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ minWidth: 240 }}>
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 160 }}>
                    Mobile
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 120 }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, idx) => (
                  <tr key={student.userId}>
                    <td className="px-4 py-3 text-secondary text-center">{idx + 1}</td>

                    <td className="px-4 py-3 text-center">
                      <NavLink
                        to={`/admin/students/${student.userId}`}
                        className="text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/admin/students/${student.userId}`);
                        }}
                        style={{ color: "#4f46e5", fontWeight: 600 }}
                      >
                        {student.prn}
                      </NavLink>
                    </td>

                    <td className="px-4 py-3 text-secondary text-center">
                      {[student.firstName, student.lastName].filter(Boolean).join(" ")}
                    </td>
                    <td className="px-4 py-3 text-secondary text-center">{student.email}</td>
                    <td className="px-4 py-3 text-secondary text-center">{student.mobile}</td>

                    <td className="px-4 py-3">
                      <div className="d-inline-flex align-items-center gap-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-secondary"
                          onClick={() => openEditModal(student.userId)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-danger"
                          onClick={() => setDeleteTarget(student)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {loading ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={6}>
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-danger" colSpan={6}>
                      {error}
                    </td>
                  </tr>
                ) : !students.length ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={6}>
                      No students found.
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

export default StudentsPage;
