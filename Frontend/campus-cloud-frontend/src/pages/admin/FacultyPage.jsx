import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import Modal from "../../components/common/Modal";
import academicService from "../../services/api/academicService";
import userService from "../../services/api/userService";
import { toast } from "react-toastify";

const FacultyPage = () => {
  const navigate = useNavigate();
  const BATCH_STORAGE_KEY = "admin_faculty_selectedBatchId";
  const COURSE_STORAGE_KEY = "admin_faculty_selectedBatchCourseId";
  const SUBJECT_STORAGE_KEY = "admin_faculty_selectedBatchCourseSubjectId";

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

  const [selectedBatchCourseSubjectId, setSelectedBatchCourseSubjectId] = useState(() => {
    try {
      return localStorage.getItem(SUBJECT_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });

  const [batches, setBatches] = useState([]);
  const [batchCourses, setBatchCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [allFaculties, setAllFaculties] = useState([]);
  const [facultySearch, setFacultySearch] = useState("");
  const [selectedFacultyUserId, setSelectedFacultyUserId] = useState("");
  const [selectedSubjectIdForAssign, setSelectedSubjectIdForAssign] = useState("");
  const [savingAssign, setSavingAssign] = useState(false);

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

  const selectedSubjectFilterBcsId = useMemo(() => {
    const value = String(selectedBatchCourseSubjectId || "");
    if (!value) return "";
    const exists = (Array.isArray(subjects) ? subjects : []).some(
      (s) => String(s.batchCourseSubjectId) === value
    );
    return exists ? value : "";
  }, [selectedBatchCourseSubjectId, subjects]);

  const breadcrumbItems = selectedBatch
    ? selectedCourse
      ? [
          { label: "Faculty", to: "/admin/faculty" },
          { label: selectedBatch.batchName },
          { label: selectedCourse.courseCode },
        ]
      : [{ label: "Faculty", to: "/admin/faculty" }, { label: selectedBatch.batchName }]
    : [{ label: "Faculty" }];

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
    try {
      localStorage.setItem(SUBJECT_STORAGE_KEY, String(selectedSubjectFilterBcsId || ""));
    } catch {
      // ignore
    }
  }, [selectedSubjectFilterBcsId]);

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

    const fetchBatchCourses = async () => {
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

    fetchBatchCourses();
    return () => {
      isMounted = false;
    };
  }, [selectedBatchId]);

  useEffect(() => {
    if (!effectiveBatchCourseId) {
      setSubjects([]);
      setSelectedBatchCourseSubjectId("");
      return;
    }

    let isMounted = true;
    const fetchSubjects = async () => {
      try {
        const data = await academicService.getSubjectsByBatchCourseId(effectiveBatchCourseId);
        if (!isMounted) return;
        setSubjects(Array.isArray(data) ? data : []);
      } catch {
        if (!isMounted) return;
        setSubjects([]);
      }
    };

    fetchSubjects();
    return () => {
      isMounted = false;
    };
  }, [effectiveBatchCourseId]);

  const refreshFaculties = async () => {
    if (!effectiveBatchCourseId) {
      setFacultyList([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let facultyUserIds = [];

      if (selectedSubjectFilterBcsId) {
        const assignments = await academicService.getFacultiesBySubject(selectedSubjectFilterBcsId);
        facultyUserIds = (Array.isArray(assignments) ? assignments : []).map((a) => a.userId).filter(Boolean);
      } else {
        const ids = await academicService.getFacultyIdsByBatchCourse(effectiveBatchCourseId);
        facultyUserIds = Array.isArray(ids) ? ids : [];
      }

      if (!facultyUserIds.length) {
        setFacultyList([]);
        return;
      }

      const users = await userService.getFacultiesByIds(facultyUserIds);
      setFacultyList(Array.isArray(users) ? users : []);
    } catch (err) {
      setError(err?.message || "Failed to load faculty list");
      setFacultyList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFaculties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveBatchCourseId, selectedSubjectFilterBcsId]);

  const openAssignModal = async () => {
    if (!selectedBatch || !selectedCourse) {
      toast.error("Please select batch and course", { autoClose: 3000 });
      return;
    }
    setIsAssignModalOpen(true);
    setSelectedFacultyUserId("");
    setFacultySearch("");
    setSelectedSubjectIdForAssign("");
    try {
      const all = await userService.getFaculties();
      setAllFaculties(Array.isArray(all) ? all : []);
    } catch {
      setAllFaculties([]);
    }
  };

  const closeAssignModal = () => {
    if (savingAssign) return;
    setIsAssignModalOpen(false);
  };

  const filteredFacultyOptions = useMemo(() => {
    const query = String(facultySearch || "").trim().toLowerCase();
    const list = Array.isArray(allFaculties) ? allFaculties : [];
    if (!query) return list;
    return list.filter((f) => {
      const fullName = [f.firstName, f.lastName].filter(Boolean).join(" ").toLowerCase();
      const idStr = String(f.userId || "");
      const usernameStr = String(f.username || "").toLowerCase();
      const mobileStr = String(f.mobile || "");
      return (
        fullName.includes(query) ||
        idStr.includes(query) ||
        usernameStr.includes(query) ||
        mobileStr.includes(query)
      );
    });
  }, [allFaculties, facultySearch]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedBatch || !selectedCourse) {
      toast.error("Please select batch and course", { autoClose: 3000 });
      return;
    }
    if (!selectedFacultyUserId) {
      toast.error("Please select a faculty", { autoClose: 3000 });
      return;
    }
    if (!selectedSubjectIdForAssign) {
      toast.error("Please select a subject", { autoClose: 3000 });
      return;
    }

    setSavingAssign(true);
    try {
      await academicService.assignFaculty({
        userId: Number(selectedFacultyUserId),
        batchId: Number(selectedBatch.batchId),
        courseId: Number(selectedCourse.courseId),
        subjectId: Number(selectedSubjectIdForAssign),
      });
      toast.success("Faculty assigned successfully", { autoClose: 2500 });
      closeAssignModal();
      await refreshFaculties();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to assign faculty", { autoClose: 3500 });
    } finally {
      setSavingAssign(false);
    }
  };

  return (
    <div className="faculty-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <Modal isOpen={isAssignModalOpen} onClose={closeAssignModal} title="Assign Faculty">
        <form onSubmit={handleAssign}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-semibold">Faculty Search & Selection</label>
              <input
                type="text"
                className="form-control"
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                placeholder="🔎 Search by name or facultyId"
                disabled={savingAssign}
              />
            </div>

            <div className="col-12">
              <div className="border rounded" style={{ maxHeight: 190, overflow: "auto" }}>
                <table className="table table-sm mb-0 align-middle">
                  <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                    <tr>
                      <th className="px-3 py-2 text-center" style={{ width: 60 }}>
                        Select
                      </th>
                      <th className="px-3 py-2 text-center" style={{ width: 160 }}>
                        Username
                      </th>
                      <th className="px-3 py-2 text-center" style={{ minWidth: 220 }}>
                        Full Name
                      </th>
                      <th className="px-3 py-2 text-center" style={{ minWidth: 240 }}>
                        Email
                      </th>
                      <th className="px-3 py-2 text-center" style={{ width: 170 }}>
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFacultyOptions.map((f) => {
                      const fullName = [f.firstName, f.lastName].filter(Boolean).join(" ");
                      const checked = String(selectedFacultyUserId) === String(f.userId);
                      return (
                        <tr
                          key={f.userId}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            if (savingAssign) return;
                            setSelectedFacultyUserId(String(f.userId));
                          }}
                        >
                          <td className="px-3 py-2 text-center">
                            <input
                              type="radio"
                              name="selectedFaculty"
                              checked={checked}
                              onChange={() => {
                                if (savingAssign) return;
                                setSelectedFacultyUserId(String(f.userId));
                              }}
                              disabled={savingAssign}
                            />
                          </td>
                          <td className="px-3 py-2 text-secondary text-center">{f.username || "-"}</td>
                          <td className="px-3 py-2 text-secondary text-center">{fullName || "-"}</td>
                          <td className="px-3 py-2 text-secondary text-center">{f.email || "-"}</td>
                          <td className="px-3 py-2 text-secondary text-center">{f.mobile || "-"}</td>
                        </tr>
                      );
                    })}

                    {!filteredFacultyOptions.length ? (
                      <tr>
                        <td className="px-3 py-3 text-center text-secondary" colSpan={5}>
                          No faculty found.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-12">
              <div className="fw-semibold mb-2">Subject</div>
              <label className="form-label fw-semibold">Dropdown to select one subject *</label>
              <select
                className="form-select"
                value={selectedSubjectIdForAssign}
                onChange={(e) => setSelectedSubjectIdForAssign(e.target.value)}
                disabled={savingAssign || !(Array.isArray(subjects) && subjects.length)}
              >
                <option value="">Select subject</option>
                {(Array.isArray(subjects) ? subjects : []).map((s) => (
                  <option key={s.batchCourseSubjectId} value={s.subjectId}>
                    {s.subjectCode} - {s.subjectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-light border" onClick={closeAssignModal} disabled={savingAssign}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={savingAssign}>
              {savingAssign ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </Modal>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <h4 className="fw-bold mb-0">Faculty List</h4>

              <div className="d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                <span className="text-secondary">Batch</span>
                <select
                  className="form-select"
                  style={{ width: 170 }}
                  value={selectedBatchId}
                  onChange={(e) => {
                    setSelectedBatchId(e.target.value);
                    setSelectedBatchCourseId("");
                    setSelectedBatchCourseSubjectId("");
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
                  onChange={(e) => {
                    setSelectedBatchCourseId(e.target.value);
                    setSelectedBatchCourseSubjectId("");
                  }}
                  disabled={!courseOptions.length}
                >
                  {courseOptions.map((c) => (
                    <option key={c.batchCourseId} value={c.batchCourseId}>
                      {c.courseCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                <span className="text-secondary">Subject</span>
                <select
                  className="form-select"
                  style={{ width: 220 }}
                  value={selectedSubjectFilterBcsId}
                  onChange={(e) => setSelectedBatchCourseSubjectId(e.target.value)}
                  disabled={!effectiveBatchCourseId}
                >
                  <option value="">None</option>
                  {(Array.isArray(subjects) ? subjects : []).map((s) => (
                    <option key={s.batchCourseSubjectId} value={s.batchCourseSubjectId}>
                      {s.subjectCode} - {s.subjectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                onClick={() => navigate("/admin/faculty/manage")}
              >
                <Plus size={18} />
                Add New Faculty
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
                    Faculty ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 200 }}>
                    Faculty Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ minWidth: 240 }}>
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 160 }}>
                    Mobile
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 160 }}>
                    Username
                  </th>
                </tr>
              </thead>

              <tbody>
                {facultyList.map((faculty, idx) => (
                  <tr key={faculty.userId}>
                    <td className="px-4 py-3 text-secondary text-center">{idx + 1}</td>

                    <td className="px-4 py-3 text-center">
                      <NavLink
                        to={`/admin/faculty/${faculty.userId}`}
                        className="text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/admin/faculty/${faculty.userId}`);
                        }}
                        style={{ color: "#4f46e5", fontWeight: 600 }}
                      >
                        {faculty.userId}
                      </NavLink>
                    </td>

                    <td className="px-4 py-3 text-secondary text-center">
                      {[faculty.firstName, faculty.lastName].filter(Boolean).join(" ")}
                    </td>
                    <td className="px-4 py-3 text-secondary text-center">{faculty.email}</td>
                    <td className="px-4 py-3 text-secondary text-center">{faculty.mobile}</td>
                    <td className="px-4 py-3 text-secondary text-center">{faculty.username}</td>
                  </tr>
                ))}

                <tr>
                  <td className="px-3 py-3" colSpan={6}>
                    <button
                      type="button"
                      className="btn w-100 border text-secondary"
                      style={{ background: "#f3f4f6" }}
                      onClick={openAssignModal}
                      disabled={!selectedBatch || !selectedCourse}
                    >
                      + Assign faculty to this batch/course
                    </button>
                  </td>
                </tr>

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
                ) : !facultyList.length ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={6}>
                      No faculty found.
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

export default FacultyPage;
