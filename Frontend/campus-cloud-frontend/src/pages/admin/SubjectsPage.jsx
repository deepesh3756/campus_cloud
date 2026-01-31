import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Check, ChevronDown, Pencil, Plus, Search, Trash2 } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import academicService from "../../services/api/academicService";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import { toast } from "react-toastify";

const FACULTY_OPTIONS = [
  "Pankaj",
  "Dhananjay",
  "Anu mitra",
  "Madhuri",
  "Swati",
  "Amit rajpoot",
  "Atul wattam",
  "Kishori Khadilkar",
  "Trupti sathe",
  "Jubera khan",
  "Shweta singh",
];

const SubjectsPage = () => {
  const navigate = useNavigate();
  const BATCH_STORAGE_KEY = "admin_subjects_selectedBatchId";
  const COURSE_STORAGE_KEY = "admin_subjects_selectedCourseId";

  const [selectedBatchId, setSelectedBatchId] = useState(() => {
    try {
      return localStorage.getItem(BATCH_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });

  const [selectedCourseId, setSelectedCourseId] = useState(() => {
    try {
      return localStorage.getItem(COURSE_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  });

  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [allSubjects, setAllSubjects] = useState([]);
  const [modalSubjectId, setModalSubjectId] = useState("");
  const [modalSubjectName, setModalSubjectName] = useState("");
  const [modalErrors, setModalErrors] = useState({});
  const [savingModal, setSavingModal] = useState(false);

  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");

  const [facultyDropdownOpen, setFacultyDropdownOpen] = useState(false);
  const [facultySearch, setFacultySearch] = useState("");
  const [selectedFaculties, setSelectedFaculties] = useState([]);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    try {
      if (selectedBatchId) localStorage.setItem(BATCH_STORAGE_KEY, String(selectedBatchId));
    } catch {
      // ignore
    }
  }, [selectedBatchId]);

  useEffect(() => {
    try {
      if (selectedCourseId) localStorage.setItem(COURSE_STORAGE_KEY, String(selectedCourseId));
    } catch {
      // ignore
    }
  }, [selectedCourseId]);

  useEffect(() => {
    let isMounted = true;

    const fetchBatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await academicService.getBatches();
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          setBatches(list);
          if (!selectedBatchId && list.length) {
            setSelectedBatchId(String(list[0].batchId));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load batches");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBatches();
    return () => {
      isMounted = false;
    };
  }, [selectedBatchId]);

  useEffect(() => {
    if (!selectedBatchId) return;

    let isMounted = true;

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await academicService.getCoursesByBatch(selectedBatchId);
        if (!isMounted) return;

        const list = Array.isArray(data) ? data : [];
        setCourses(list);

        const isSelectedValid = list.some((c) => String(c.courseId) === String(selectedCourseId));
        if (!isSelectedValid) {
          setSelectedCourseId(list[0]?.courseId ? String(list[0].courseId) : "");
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load courses");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [selectedBatchId, selectedCourseId]);

  useEffect(() => {
    let isMounted = true;

    const fetchAllSubjects = async () => {
      try {
        const data = await academicService.getSubjects();
        if (!isMounted) return;
        setAllSubjects(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err?.message || "Failed to load subjects", { autoClose: 3500 });
      }
    };

    fetchAllSubjects();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedBatchId || !selectedCourseId) return;

    let isMounted = true;

    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await academicService.getSubjectsByBatchAndCourse(selectedBatchId, selectedCourseId);
        if (isMounted) {
          setSubjects(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load subjects");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSubjects();
    return () => {
      isMounted = false;
    };
  }, [selectedBatchId, selectedCourseId]);

  const selectedBatch = batches.find((b) => String(b.batchId) === String(selectedBatchId)) || null;
  const courseOptions = useMemo(() => courses, [courses]);
  const effectiveCourseId = courseOptions.some((c) => String(c.courseId) === String(selectedCourseId))
    ? selectedCourseId
    : courseOptions[0]?.courseId ? String(courseOptions[0].courseId) : "";

  const selectedCourse = courseOptions.find((c) => String(c.courseId) === String(effectiveCourseId)) || null;

  const filteredSubjects = subjects;

  const preferredSubjectPrefix = useMemo(() => {
    const code = String(selectedCourse?.courseCode || "");
    const tail = code.includes("PG-") ? code.split("PG-").pop() : "";
    return String(tail || "").slice(0, 3).toUpperCase();
  }, [selectedCourse?.courseCode]);

  const subjectOptions = useMemo(() => {
    const q = subjectSearch.trim().toLowerCase();
    const list = Array.isArray(allSubjects) ? allSubjects : [];
    const filtered = q
      ? list.filter((s) => {
          const code = String(s?.subjectCode || "").toLowerCase();
          const name = String(s?.subjectName || "").toLowerCase();
          return code.includes(q) || name.includes(q);
        })
      : list;

    return [...filtered].sort((a, b) => {
      const aCode = String(a?.subjectCode || "");
      const bCode = String(b?.subjectCode || "");

      const aPref = preferredSubjectPrefix && aCode.slice(0, 3).toUpperCase() === preferredSubjectPrefix;
      const bPref = preferredSubjectPrefix && bCode.slice(0, 3).toUpperCase() === preferredSubjectPrefix;
      if (aPref !== bPref) return aPref ? -1 : 1;
      return aCode.localeCompare(bCode);
    });
  }, [allSubjects, preferredSubjectPrefix, subjectSearch]);

  const filteredFacultyOptions = useMemo(() => {
    const q = facultySearch.trim().toLowerCase();
    if (!q) return FACULTY_OPTIONS;
    return FACULTY_OPTIONS.filter((f) => f.toLowerCase().includes(q));
  }, [facultySearch]);

  const toggleFaculty = (faculty) => {
    setSelectedFaculties((prev) => {
      if (prev.includes(faculty)) return prev.filter((f) => f !== faculty);
      return [...prev, faculty];
    });
  };

  const resetAddModal = () => {
    setModalSubjectId("");
    setModalSubjectName("");
    setModalErrors({});
    setSubjectDropdownOpen(false);
    setSubjectSearch("");
    setFacultyDropdownOpen(false);
    setFacultySearch("");
    setSelectedFaculties([]);
  };

  const openAddModal = () => {
    resetAddModal();
    setIsAddModalOpen(true);
  };

  const validateAddModal = () => {
    const next = {};
    if (!selectedBatchId) next.batch = "Batch is required";
    if (!effectiveCourseId) next.course = "Course is required";
    if (!modalSubjectId) next.subject = "Please select a subject";
    setModalErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSaveAddModal = async () => {
    if (!validateAddModal()) return;

    const sid = Number(modalSubjectId);
    if (Number.isNaN(sid) || sid <= 0) {
      toast.error("Invalid subject selected", { autoClose: 3500 });
      return;
    }

    const picked = allSubjects.find((s) => String(s.subjectId) === String(modalSubjectId));
    const subjectCode = picked?.subjectCode || "";
    const batchName = selectedBatch?.batchName || "";
    const courseCode = selectedCourse?.courseCode || "";

    setSavingModal(true);
    try {
      await academicService.addSubjectsToBatchCourse({
        batchId: Number(selectedBatchId),
        courseId: Number(effectiveCourseId),
        subjectIds: [sid],
      });

      toast.success(`Subject ${subjectCode || ""} added to ${batchName || ""} ${courseCode || ""}`.trim(), {
        autoClose: 2500,
      });
      setIsAddModalOpen(false);

      const refreshed = await academicService.getSubjectsByBatchAndCourse(selectedBatchId, effectiveCourseId);
      setSubjects(Array.isArray(refreshed) ? refreshed : []);
    } catch (err) {
      toast.error(err?.message || "Failed to add subject", { autoClose: 3500 });
    } finally {
      setSavingModal(false);
    }
  };

  const breadcrumbItems = selectedBatch
    ? selectedCourse
      ? [
          { label: "Subjects", to: "/admin/subjects" },
          { label: selectedBatch.batchName },
          { label: selectedCourse.courseCode },
        ]
      : [{ label: "Subjects", to: "/admin/subjects" }, { label: selectedBatch.batchName }]
    : [{ label: "Subjects" }];

  const getApiErrorMessage = (err, fallback) => {
    const apiMessage = err?.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage;
    const message = err?.message;
    if (typeof message === "string" && message.trim()) return message;
    return fallback;
  };

  const handleDelete = (subject) => {
    setDeleteTarget(subject);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.batchCourseSubjectId) return;
    setDeleting(true);
    try {
      await academicService.deleteBatchCourseSubject(deleteTarget.batchCourseSubjectId);
      setSubjects((prev) => prev.filter((s) => s.batchCourseSubjectId !== deleteTarget.batchCourseSubjectId));
      toast.success("Subject deleted successfully", { autoClose: 2500 });
      setDeleteTarget(null);
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to delete subject");
      toast.error(message, { autoClose: 3500 });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="subjects-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Subject"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.subjectName} from this course?`
            : "Are you sure you want to delete this subject?"
        }
        loading={deleting}
        onCancel={() => (deleting ? null : setDeleteTarget(null))}
        onConfirm={handleConfirmDelete}
      />

      {isAddModalOpen ? (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.45)" }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 14, overflow: "visible" }}>
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Subject to Course</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => (savingModal ? null : setIsAddModalOpen(false))}
                />
              </div>

              <div className="modal-body" style={{ overflow: "visible" }}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Subject Code</label>

                    <div className="position-relative">
                      <button
                        type="button"
                        className={`form-control d-flex align-items-center justify-content-between ${
                          modalErrors.subject ? "is-invalid" : ""
                        }`}
                        onClick={() => setSubjectDropdownOpen((p) => !p)}
                        disabled={savingModal}
                        style={{ cursor: "pointer" }}
                      >
                        <span className={modalSubjectId ? "" : "text-secondary"} style={{ fontSize: 14 }}>
                          {modalSubjectId
                            ? String(allSubjects.find((s) => String(s.subjectId) === String(modalSubjectId))?.subjectCode || "")
                            : "Select subject"}
                        </span>
                        <ChevronDown size={18} className="text-secondary" />
                      </button>

                      {modalErrors.subject ? <div className="invalid-feedback d-block">{modalErrors.subject}</div> : null}

                      {subjectDropdownOpen ? (
                        <div
                          className="position-absolute bg-white border shadow-sm w-100 mt-2"
                          style={{ zIndex: 2000, borderRadius: 12 }}
                        >
                          <div className="p-2 border-bottom">
                            <div className="input-group">
                              <span className="input-group-text bg-white border-0">
                                <Search size={16} className="text-secondary" />
                              </span>
                              <input
                                type="text"
                                className="form-control border-0"
                                value={subjectSearch}
                                onChange={(e) => setSubjectSearch(e.target.value)}
                                placeholder="Search subject code"
                                autoFocus
                              />
                            </div>
                          </div>

                          <div style={{ maxHeight: 220, overflowY: "auto" }}>
                            {subjectOptions.map((s) => (
                              <button
                                type="button"
                                key={s.subjectId}
                                className="w-100 btn text-start d-flex align-items-center justify-content-between px-3 py-2"
                                onClick={() => {
                                  setModalSubjectId(String(s.subjectId));
                                  setModalSubjectName(s.subjectName || "");
                                  setModalErrors({});
                                  setSubjectDropdownOpen(false);
                                }}
                              >
                                <span style={{ color: "#4f46e5", fontWeight: 600 }}>{s.subjectCode}</span>
                                {String(modalSubjectId) === String(s.subjectId) ? (
                                  <Check size={18} style={{ color: "#4f46e5" }} />
                                ) : (
                                  <span />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Subject Name</label>
                    <input type="text" className="form-control" value={modalSubjectName} readOnly />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Faculty(s) (Optional)</label>

                    <div className="position-relative">
                      <button
                        type="button"
                        className="form-control d-flex align-items-center justify-content-between"
                        onClick={() => setFacultyDropdownOpen((p) => !p)}
                        disabled={savingModal}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center flex-wrap gap-2" style={{ minHeight: 24 }}>
                          {selectedFaculties.length ? (
                            selectedFaculties.map((f) => (
                              <span
                                key={f}
                                className="badge text-bg-light border"
                                style={{ fontWeight: 600 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFaculty(f);
                                }}
                              >
                                {f} <span className="ms-1">×</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-secondary" style={{ fontSize: 14 }}>
                              Select faculties
                            </span>
                          )}
                        </div>
                        <ChevronDown size={18} className="text-secondary" />
                      </button>

                      {facultyDropdownOpen ? (
                        <div
                          className="position-absolute bg-white border shadow-sm w-100 mt-2"
                          style={{ zIndex: 2000, borderRadius: 12 }}
                        >
                          <div className="p-2 border-bottom">
                            <div className="input-group">
                              <span className="input-group-text bg-white border-0">
                                <Search size={16} className="text-secondary" />
                              </span>
                              <input
                                type="text"
                                className="form-control border-0"
                                value={facultySearch}
                                onChange={(e) => setFacultySearch(e.target.value)}
                                placeholder="Search faculty"
                              />
                            </div>
                          </div>

                          <div style={{ maxHeight: 220, overflowY: "auto" }}>
                            {filteredFacultyOptions.map((faculty) => {
                              const selected = selectedFaculties.includes(faculty);
                              return (
                                <button
                                  type="button"
                                  key={faculty}
                                  className="w-100 btn text-start d-flex align-items-center justify-content-between px-3 py-2"
                                  onClick={() => toggleFaculty(faculty)}
                                >
                                  <span style={{ color: "#4f46e5", fontWeight: 600 }}>{faculty}</span>
                                  {selected ? <Check size={18} style={{ color: "#4f46e5" }} /> : <span />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light border"
                  onClick={() => (savingModal ? null : setIsAddModalOpen(false))}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveAddModal}
                  disabled={savingModal}
                >
                  {savingModal ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <h4 className="fw-bold mb-0">Subject List</h4>

              <div className="d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                <span className="text-secondary">Batch</span>
                <select
                  className="form-select"
                  style={{ width: 170 }}
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
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
                  value={effectiveCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  disabled={!courseOptions.length}
                >
                  {courseOptions.map((c) => (
                    <option key={c.courseId} value={c.courseId}>
                      {c.courseCode}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center gap-2"
              onClick={() => navigate("/admin/subjects/new")}
            >
              <Plus size={18} />
              Add New Subject
            </button>
          </div>

          <div className="table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 80 }}>
                    S.no
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 180 }}>
                    Subject Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 140 }}>
                    Subject Code
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ minWidth: 260 }}>
                    Faculty(s)
                  </th>
                  <th scope="col" className="px-4 py-3 text-center" style={{ width: 120 }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={5}>
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td className="px-4 py-4 text-center text-danger" colSpan={5}>
                      {error}
                    </td>
                  </tr>
                ) : filteredSubjects.length ? (
                  filteredSubjects.map((subject, idx) => (
                    <tr key={subject.batchCourseSubjectId}>
                    <td className="px-4 py-3 text-secondary text-center">{idx + 1}</td>

                    <td className="px-4 py-3 text-center">
                      <NavLink
                        to={`/admin/subjects/${subject.batchCourseSubjectId}`}
                        className="text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/admin/subjects/${subject.batchCourseSubjectId}`);
                        }}
                        style={{ color: "#4f46e5", fontWeight: 600 }}
                      >
                        {subject.subjectName}
                      </NavLink>
                    </td>

                    <td className="px-4 py-3 text-secondary text-center" style={{ whiteSpace: "nowrap" }}>
                      {subject.subjectCode}
                    </td>

                    <td className="px-4 py-3 text-secondary text-center" style={{ minWidth: 260 }}>
                      -
                    </td>

                    <td className="px-4 py-3">
                      <div className="d-inline-flex align-items-center gap-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-secondary"
                          onClick={() => navigate(`/admin/subjects/${subject.batchCourseSubjectId}/edit`)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-danger"
                          onClick={() => handleDelete(subject)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-4 text-center text-secondary" colSpan={5}>
                      No subjects found.
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td className="px-4 py-3" colSpan={5}>
                    <button
                      type="button"
                      className="btn btn-light border w-100 d-inline-flex align-items-center justify-content-center gap-2"
                      style={{ backgroundColor: "#f8f9fa" }}
                      onClick={openAddModal}
                      disabled={!selectedBatchId || !effectiveCourseId}
                    >
                      <Plus size={18} />
                      Add Subject to Course
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectsPage;
