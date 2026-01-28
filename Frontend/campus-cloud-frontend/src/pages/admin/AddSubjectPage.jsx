import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

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

const AddSubjectPage = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const isEdit = Boolean(subjectId);

  const existingSubjects = useMemo(
    () => [
      {
        id: "cpp01-aug-2025-pg-dac",
        code: "CPP01",
        name: "C++",
        startDate: "2025-08-01",
        endDate: "2026-02-01",
        faculties: ["Pankaj", "Dhananjay", "Anu mitra"],
        status: "Active",
      },
    ],
    []
  );

  const existing = isEdit ? existingSubjects.find((s) => s.id === subjectId) : null;

  const [subjectCode, setSubjectCode] = useState(existing?.code || "");
  const [subjectName, setSubjectName] = useState(existing?.name || "");
  const [startDate, setStartDate] = useState(existing?.startDate || "");
  const [endDate, setEndDate] = useState(existing?.endDate || "");
  const [faculties, setFaculties] = useState(existing?.faculties || []);
  const [status, setStatus] = useState(existing?.status || "Active");

  const [facultyDropdownOpen, setFacultyDropdownOpen] = useState(false);
  const [facultySearch, setFacultySearch] = useState("");

  const [errors, setErrors] = useState({});

  const breadcrumbItems = useMemo(() => {
    if (isEdit) {
      return [{ label: "Subjects", to: "/admin/subjects" }, { label: "Edit Subject" }];
    }

    return [{ label: "Subjects", to: "/admin/subjects" }, { label: "Add Subject" }];
  }, [isEdit]);

  const filteredFacultyOptions = useMemo(() => {
    const q = facultySearch.trim().toLowerCase();
    if (!q) return FACULTY_OPTIONS;
    return FACULTY_OPTIONS.filter((f) => f.toLowerCase().includes(q));
  }, [facultySearch]);

  const toggleFaculty = (faculty) => {
    setFaculties((prev) => {
      if (prev.includes(faculty)) return prev.filter((f) => f !== faculty);
      return [...prev, faculty];
    });
  };

  const validate = () => {
    const next = {};

    const trimmedCode = subjectCode.trim();
    const trimmedName = subjectName.trim();

    if (!trimmedCode) next.subjectCode = "Subject Code is required";
    else if (trimmedCode.length < 2 || trimmedCode.length > 20) {
      next.subjectCode = "Subject Code must be 2-20 characters";
    }

    if (!trimmedName) next.subjectName = "Subject Name is required";
    else if (trimmedName.length < 2 || trimmedName.length > 100) {
      next.subjectName = "Subject Name must be 2-100 characters";
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

    if (!faculties.length) next.faculties = "Please select at least one faculty";
    if (!status) next.status = "Status is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    navigate("/admin/subjects");
  };

  return (
    <div className="add-subject-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="d-flex justify-content-center">
        <div className="card border-0 shadow-sm w-100" style={{ maxWidth: 760, borderRadius: 14 }}>
          <div className="card-body p-4">
            <h4 className="fw-bold mb-4">Add New Subject / Edit Subject</h4>

            <form onSubmit={handleSave}>
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Subject Code</label>
                  <input
                    type="text"
                    className={`form-control ${errors.subjectCode ? "is-invalid" : ""}`}
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="CPP01"
                  />
                  {errors.subjectCode ? <div className="invalid-feedback">{errors.subjectCode}</div> : null}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Subject Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.subjectName ? "is-invalid" : ""}`}
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="C++"
                  />
                  {errors.subjectName ? <div className="invalid-feedback">{errors.subjectName}</div> : null}
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
                  <label className="form-label fw-semibold">Faculty(s)</label>

                  <div className="position-relative">
                    <button
                      type="button"
                      className={`form-control d-flex align-items-center justify-content-between ${
                        errors.faculties ? "is-invalid" : ""
                      }`}
                      onClick={() => setFacultyDropdownOpen((p) => !p)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center flex-wrap gap-2" style={{ minHeight: 24 }}>
                        {faculties.length ? (
                          faculties.map((f) => (
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

                    {errors.faculties ? <div className="invalid-feedback d-block">{errors.faculties}</div> : null}

                    {facultyDropdownOpen ? (
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
                              value={facultySearch}
                              onChange={(e) => setFacultySearch(e.target.value)}
                              placeholder="Search"
                            />
                
                          </div>
                        </div>

                        <div style={{ maxHeight: 220, overflowY: "auto" }}>
                          {filteredFacultyOptions.map((faculty) => {
                            const selected = faculties.includes(faculty);
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
                    onClick={() => navigate("/admin/subjects")}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Subject
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

export default AddSubjectPage;
