import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const SUBJECT_OPTIONS = [
  "C++",
  "Java",
  "Data Structures and Algorithms",
  "Web based Java programming",
  "Databases",
  "COSDM",
  "Microsoft .Net",
  "Operating Systems",
  "WPT",
];

const AddCoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const isEdit = Boolean(courseId);

  const existingCourses = useMemo(
    () => [
      {
        id: "pg-dac-aug-2025",
        code: "PG-DAC",
        name: "Post graduate diploma in advanced computing",
        startDate: "2025-08-01",
        endDate: "2026-02-01",
        subjects: ["C++", "Java", "Data Structures and Algorithms"],
        status: "Active",
      },
    ],
    []
  );

  const existing = isEdit ? existingCourses.find((c) => c.id === courseId) : null;

  const [courseCode, setCourseCode] = useState(existing?.code || "");
  const [courseName, setCourseName] = useState(existing?.name || "");
  const [startDate, setStartDate] = useState(existing?.startDate || "");
  const [endDate, setEndDate] = useState(existing?.endDate || "");
  const [status, setStatus] = useState(existing?.status || "Active");
  const [subjects, setSubjects] = useState(existing?.subjects || []);

  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");

  const [errors, setErrors] = useState({});

  const breadcrumbItems = useMemo(() => {
    if (isEdit) {
      return [{ label: "Courses", to: "/admin/courses" }, { label: "Edit Course" }];
    }

    return [{ label: "Courses", to: "/admin/courses" }, { label: "Add Course" }];
  }, [isEdit]);

  const filteredSubjectOptions = useMemo(() => {
    const q = subjectSearch.trim().toLowerCase();
    if (!q) return SUBJECT_OPTIONS;
    return SUBJECT_OPTIONS.filter((s) => s.toLowerCase().includes(q));
  }, [subjectSearch]);

  const toggleSubject = (subject) => {
    setSubjects((prev) => {
      if (prev.includes(subject)) return prev.filter((s) => s !== subject);
      return [...prev, subject];
    });
  };

  const validate = () => {
    const next = {};

    const trimmedCode = courseCode.trim();
    const trimmedName = courseName.trim();

    if (!trimmedCode) next.courseCode = "Course Code is required";
    else if (trimmedCode.length < 2 || trimmedCode.length > 20) {
      next.courseCode = "Course Code must be 2-20 characters";
    }

    if (!trimmedName) next.courseName = "Course Name is required";
    else if (trimmedName.length < 2 || trimmedName.length > 100) {
      next.courseName = "Course Name must be 2-100 characters";
    }

    if (!startDate) next.startDate = "Start Date is required";
    if (!endDate) next.endDate = "End Date is required";

    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      s.setHours(0, 0, 0, 0);
      e.setHours(0, 0, 0, 0);
      if (e < s) next.endDate = "End Date cannot be before Start Date";
    }

    if (!status) next.status = "Status is required";
    if (!subjects.length) next.subjects = "Please select at least one subject";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    navigate("/admin/courses");
  };

  return (
    <div className="add-course-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="d-flex justify-content-center">
        <div className="card border-0 shadow-sm w-100" style={{ maxWidth: 760, borderRadius: 14 }}>
          <div className="card-body p-4">
            <h4 className="fw-bold mb-4">Add New Course / Edit course</h4>

            <form onSubmit={handleSave}>
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Course Code</label>
                  <input
                    type="text"
                    className={`form-control ${errors.courseCode ? "is-invalid" : ""}`}
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="PG-DAC"
                  />
                  {errors.courseCode ? <div className="invalid-feedback">{errors.courseCode}</div> : null}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Course Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.courseName ? "is-invalid" : ""}`}
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Post graduate diploma in advanced computing"
                  />
                  {errors.courseName ? <div className="invalid-feedback">{errors.courseName}</div> : null}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Start Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  {errors.startDate ? <div className="invalid-feedback">{errors.startDate}</div> : null}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">End Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  {errors.endDate ? <div className="invalid-feedback">{errors.endDate}</div> : null}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Add Subjects</label>

                  <div className="position-relative">
                    <button
                      type="button"
                      className={`form-control d-flex align-items-center justify-content-between ${
                        errors.subjects ? "is-invalid" : ""
                      }`}
                      onClick={() => setSubjectDropdownOpen((p) => !p)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center flex-wrap gap-2" style={{ minHeight: 24 }}>
                        {subjects.length ? (
                          subjects.map((s) => (
                            <span
                              key={s}
                              className="badge text-bg-light border"
                              style={{ fontWeight: 600 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubject(s);
                              }}
                            >
                              {s} <span className="ms-1">×</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-secondary" style={{ fontSize: 14 }}>
                            Select subjects
                          </span>
                        )}
                      </div>
                      <ChevronDown size={18} className="text-secondary" />
                    </button>

                    {errors.subjects ? <div className="invalid-feedback d-block">{errors.subjects}</div> : null}

                    {subjectDropdownOpen ? (
                      <div
                        className="position-absolute bg-white border shadow-sm w-100 mt-2"
                        style={{ zIndex: 10, borderRadius: 12 }}
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
                              placeholder="Search"
                            />
                          </div>
                        </div>

                        <div style={{ maxHeight: 220, overflowY: "auto" }}>
                          {filteredSubjectOptions.map((subject) => {
                            const selected = subjects.includes(subject);
                            return (
                              <button
                                type="button"
                                key={subject}
                                className="w-100 btn text-start d-flex align-items-center justify-content-between px-3 py-2"
                                onClick={() => toggleSubject(subject)}
                              >
                                <span style={{ color: "#4f46e5", fontWeight: 600 }}>{subject}</span>
                                {selected ? <Check size={18} style={{ color: "#4f46e5" }} /> : <span />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Status</label>
                  <select
                    className={`form-select ${errors.status ? "is-invalid" : ""}`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {errors.status ? <div className="invalid-feedback">{errors.status}</div> : null}
                </div>

                <div className="col-12 d-flex justify-content-end gap-2 pt-2">
                  <button
                    type="button"
                    className="btn btn-light border"
                    onClick={() => navigate("/admin/courses")}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save course
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoursePage;
