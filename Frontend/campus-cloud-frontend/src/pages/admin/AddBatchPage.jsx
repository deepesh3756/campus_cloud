import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";

const COURSE_OPTIONS = ["PG-DAC", "PG-DAI", "PG-DBDA", "PG-DTSS", "PG-VLSI", "PG-HPCSA"];

const AddBatchPage = () => {
  const navigate = useNavigate();
  const { batchId } = useParams();

  const isEdit = Boolean(batchId);

  const existingBatches = useMemo(
    () => [
      {
        id: "aug-2025",
        name: "August - 2025",
        startDate: "2025-07-01",
        endDate: "2026-02-01",
        status: "Active",
        courses: ["PG-DAC", "PG-DAI", "PG-DBDA"],
        description: "",
      },
      {
        id: "feb-2025",
        name: "February - 2025",
        startDate: "2025-02-20",
        endDate: "2025-07-20",
        status: "Completed",
        courses: ["PG-DAC", "PG-DAI"],
        description: "",
      },
    ],
    []
  );

  const existing = isEdit ? existingBatches.find((b) => b.id === batchId) : null;

  const [batchName, setBatchName] = useState(existing?.name || "");
  const [startDate, setStartDate] = useState(existing?.startDate || "");
  const [endDate, setEndDate] = useState(existing?.endDate || "");
  const [status, setStatus] = useState(existing?.status || "Upcoming");
  const [courses, setCourses] = useState(existing?.courses || []);
  const [description, setDescription] = useState(existing?.description || "");

  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");

  const [errors, setErrors] = useState({});

  const breadcrumbItems = useMemo(() => {
    if (isEdit) {
      return [
        { label: "Batches", to: "/admin/batches" },
        { label: "Edit Batch" },
      ];
    }

    return [
      { label: "Batches", to: "/admin/batches" },
      { label: "Add Batch" },
    ];
  }, [isEdit]);

  const filteredCourseOptions = useMemo(() => {
    const q = courseSearch.trim().toLowerCase();
    if (!q) return COURSE_OPTIONS;
    return COURSE_OPTIONS.filter((c) => c.toLowerCase().includes(q));
  }, [courseSearch]);

  const toggleCourse = (course) => {
    setCourses((prev) => {
      if (prev.includes(course)) return prev.filter((c) => c !== course);
      return [...prev, course];
    });
  };

  const validate = (nextEffectiveStatus) => {
    const next = {};

    const trimmedName = batchName.trim();
    if (!trimmedName) next.batchName = "Batch Name is required";
    else if (trimmedName.length < 2 || trimmedName.length > 100) {
      next.batchName = "Batch Name must be 2-100 characters";
    }

    if (!startDate) next.startDate = "Start Date is required";
    if (!endDate) next.endDate = "End Date is required";

    if (!nextEffectiveStatus) next.status = "Status is required";
    if (!courses.length) next.courses = "Please select at least one course";

    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      s.setHours(0, 0, 0, 0);
      e.setHours(0, 0, 0, 0);
      if (e < s) next.endDate = "End Date cannot be before Start Date";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate(effectiveStatus)) return;

    navigate("/admin/batches");
  };

  const endDateInPast = useMemo(() => {
    if (!endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    return end < today;
  }, [endDate]);

  const effectiveStatus = endDateInPast ? "Completed" : status;

  return (
    <div className="add-batch-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="d-flex justify-content-center">
        <div className="card border-0 shadow-sm w-100" style={{ maxWidth: 760, borderRadius: 14 }}>
          <div className="card-body p-4">
            <h4 className="fw-bold mb-4">{isEdit ? "Add New Batch/ Edit Batch" : "Add New Batch/ Edit Batch"}</h4>

            <form onSubmit={handleSave}>
              <div className="row g-4">
                <div className="col-12 col-md-7">
                  <label className="form-label fw-semibold">Batch Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.batchName ? "is-invalid" : ""}`}
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    placeholder="DAC-2024-Jan"
                  />
                  {errors.batchName ? <div className="invalid-feedback">{errors.batchName}</div> : null}
                </div>

                <div className="col-12 col-md-5">
                  <label className="form-label fw-semibold">Status</label>
                  <select
                    className={`form-select ${errors.status ? "is-invalid" : ""}`}
                    value={effectiveStatus}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={endDateInPast}
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                  {errors.status ? <div className="invalid-feedback">{errors.status}</div> : null}
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
                  <label className="form-label fw-semibold">Add courses</label>

                  <div className="position-relative">
                    <button
                      type="button"
                      className={`form-control d-flex align-items-center justify-content-between ${errors.courses ? "is-invalid" : ""}`}
                      onClick={() => setCourseDropdownOpen((p) => !p)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center flex-wrap gap-2" style={{ minHeight: 24 }}>
                        {courses.length ? (
                          courses.map((c) => (
                            <span
                              key={c}
                              className="badge text-bg-light border"
                              style={{ fontWeight: 600 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCourse(c);
                              }}
                            >
                              {c} <span className="ms-1">×</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-secondary" style={{ fontSize: 14 }}>
                            Select courses
                          </span>
                        )}
                      </div>
                      <ChevronDown size={18} className="text-secondary" />
                    </button>

                    {errors.courses ? <div className="invalid-feedback d-block">{errors.courses}</div> : null}

                    {courseDropdownOpen ? (
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
                              value={courseSearch}
                              onChange={(e) => setCourseSearch(e.target.value)}
                              placeholder="Search"
                            />
                          </div>
                        </div>

                        <div style={{ maxHeight: 220, overflowY: "auto" }}>
                          {filteredCourseOptions.map((course) => {
                            const selected = courses.includes(course);
                            return (
                              <button
                                type="button"
                                key={course}
                                className="w-100 btn text-start d-flex align-items-center justify-content-between px-3 py-2"
                                onClick={() => toggleCourse(course)}
                              >
                                <span style={{ color: "#4f46e5", fontWeight: 600 }}>{course}</span>
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
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of batch"
                  />
                </div>

                <div className="col-12 d-flex justify-content-end gap-2 pt-2">
                  <button type="button" className="btn btn-light border" onClick={() => navigate("/admin/batches")}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Batch
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

export default AddBatchPage;
