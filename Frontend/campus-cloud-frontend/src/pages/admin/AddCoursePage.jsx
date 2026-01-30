import { useEffect, useMemo, useState } from "react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import academicService from "../../services/api/academicService";
import { toast } from "react-toastify";
import { Pencil, X, Check, Plus } from "lucide-react";

const AddCoursePage = () => {
  const NEW_COURSE_ID = "__new_course__";

  const [allCourses, setAllCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState("");

  const [editingCourseId, setEditingCourseId] = useState("");
  const [editDraft, setEditDraft] = useState({ courseCode: "", courseName: "", durationMonths: "", status: "ACTIVE" });

  const breadcrumbItems = useMemo(() => {
    return [{ label: "Courses", to: "/admin/courses" }, { label: "Add / Update Course" }];
  }, []);

  const getApiErrorMessage = (err, fallback) => {
    const apiMessage = err?.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage;
    const message = err?.message;
    if (typeof message === "string" && message.trim()) return message;
    return fallback;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAllCourses = async () => {
      setCoursesLoading(true);
      setCoursesError("");
      try {
        const data = await academicService.getCourses();
        if (!isMounted) return;
        setAllCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!isMounted) return;
        const msg = getApiErrorMessage(err, "Failed to load courses");
        setCoursesError(msg);
      } finally {
        if (isMounted) setCoursesLoading(false);
      }
    };

    fetchAllCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleStatus = async (course) => {
    if (!course?.courseId) return;

    if (String(course.courseId) === NEW_COURSE_ID) {
      setEditDraft((p) => ({
        ...p,
        status: String(p.status || "").toUpperCase() === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      }));
      return;
    }

    const nextStatus = String(course.status || "").toUpperCase() === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const updated = await academicService.updateCourse(course.courseId, { status: nextStatus });
      setAllCourses((prev) => prev.map((c) => (c.courseId === course.courseId ? updated : c)));
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update status"), { autoClose: 3500 });
    }
  };

  const startEditRow = (course) => {
    setEditingCourseId(String(course.courseId));
    setEditDraft({
      courseCode: course.courseCode || "",
      courseName: course.courseName || "",
      durationMonths: String(course.durationMonths ?? ""),
      status: String(course.status || "ACTIVE").toUpperCase(),
    });
  };

  const cancelEditRow = () => {
    if (String(editingCourseId) === NEW_COURSE_ID) {
      setAllCourses((prev) => prev.filter((c) => String(c.courseId) !== NEW_COURSE_ID));
    }
    setEditingCourseId("");
    setEditDraft({ courseCode: "", courseName: "", durationMonths: "", status: "ACTIVE" });
  };

  const saveEditRow = async (courseId) => {
    if (String(courseId) === NEW_COURSE_ID) {
      const dur = Number(editDraft.durationMonths);
      if (!editDraft.courseCode.trim() || !editDraft.courseName.trim() || !dur || Number.isNaN(dur) || dur < 1) {
        toast.error("Please provide valid Course Code, Course Name and Duration", { autoClose: 3500 });
        return;
      }

      try {
        const created = await academicService.createCourse({
          courseCode: editDraft.courseCode.trim(),
          courseName: editDraft.courseName.trim(),
          durationMonths: dur,
          status: String(editDraft.status || "ACTIVE").toUpperCase(),
        });

        setAllCourses((prev) => {
          const cleaned = prev.filter((c) => String(c.courseId) !== NEW_COURSE_ID);
          return [...cleaned, created];
        });
        cancelEditRow();
        toast.success("Course created successfully", { autoClose: 2500 });
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to create course"), { autoClose: 3500 });
      }
      return;
    }

    const cid = Number(courseId);
    if (!cid) return;

    const dur = Number(editDraft.durationMonths);
    if (!editDraft.courseCode.trim() || !editDraft.courseName.trim() || !dur || Number.isNaN(dur) || dur < 1) {
      toast.error("Please provide valid Course Code, Course Name and Duration", { autoClose: 3500 });
      return;
    }

    try {
      const updated = await academicService.updateCourse(cid, {
        courseCode: editDraft.courseCode.trim(),
        courseName: editDraft.courseName.trim(),
        durationMonths: dur,
      });
      setAllCourses((prev) => prev.map((c) => (c.courseId === cid ? updated : c)));
      cancelEditRow();
      toast.success("Course updated successfully", { autoClose: 2500 });
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update course"), { autoClose: 3500 });
    }
  };

  const addNewCourseRow = () => {
    if (String(editingCourseId) === NEW_COURSE_ID) return;
    if (allCourses.some((c) => String(c.courseId) === NEW_COURSE_ID)) return;

    setAllCourses((prev) => [
      ...prev,
      {
        courseId: NEW_COURSE_ID,
        courseCode: "",
        courseName: "",
        durationMonths: "",
        status: "ACTIVE",
      },
    ]);
    setEditingCourseId(NEW_COURSE_ID);
    setEditDraft({ courseCode: "", courseName: "", durationMonths: "", status: "ACTIVE" });
  };

  return (
    <div className="add-course-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="d-flex justify-content-center">
        <div
          className="card border-0 shadow-sm w-100"
          style={{
            maxWidth: 1100,
            borderRadius: 14,
          }}
        >
          <div className="card-body p-4">
            <h4 className="fw-bold mb-4">Add / Update Course</h4>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" className="px-3 py-3 text-center" style={{ width: 80 }}>
                        S.no
                      </th>
                      <th scope="col" className="px-3 py-3 text-center" style={{ width: 140 }}>
                        Course Code
                      </th>
                      <th scope="col" className="px-3 py-3 text-center" style={{ minWidth: 240 }}>
                        Course Name
                      </th>
                      <th scope="col" className="px-3 py-3 text-center" style={{ width: 140 }}>
                        Duration
                      </th>
                      <th scope="col" className="px-3 py-3 text-center" style={{ width: 160 }}>
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3 text-center" style={{ width: 140 }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {coursesLoading ? (
                      <tr>
                        <td className="px-3 py-4 text-center text-secondary" colSpan={6}>
                          Loading...
                        </td>
                      </tr>
                    ) : coursesError ? (
                      <tr>
                        <td className="px-3 py-4 text-center text-danger" colSpan={6}>
                          {coursesError}
                        </td>
                      </tr>
                    ) : allCourses.length ? (
                      allCourses.map((c, idx) => {
                        const isRowEditing = String(editingCourseId) === String(c.courseId);
                        return (
                          <tr key={c.courseId}>
                            <td className="px-3 py-3 text-center text-secondary">{idx + 1}</td>

                            <td className="px-3 py-3 text-center">
                              {isRowEditing ? (
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={editDraft.courseCode}
                                  onChange={(e) => setEditDraft((p) => ({ ...p, courseCode: e.target.value }))}
                                />
                              ) : (
                                <span className="fw-semibold">{c.courseCode}</span>
                              )}
                            </td>

                            <td className="px-3 py-3">
                              {isRowEditing ? (
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={editDraft.courseName}
                                  onChange={(e) => setEditDraft((p) => ({ ...p, courseName: e.target.value }))}
                                />
                              ) : (
                                <span className="text-secondary">{c.courseName}</span>
                              )}
                            </td>

                            <td className="px-3 py-3 text-center">
                              {isRowEditing ? (
                                <input
                                  type="number"
                                  min={1}
                                  className="form-control form-control-sm"
                                  value={editDraft.durationMonths}
                                  onChange={(e) => setEditDraft((p) => ({ ...p, durationMonths: e.target.value }))}
                                />
                              ) : (
                                <span className="text-secondary">{c.durationMonths}</span>
                              )}
                            </td>

                            <td className="px-3 py-3 text-center">
                              <div className="form-check form-switch d-inline-flex align-items-center gap-2">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={
                                    isRowEditing && String(c.courseId) === NEW_COURSE_ID
                                      ? String(editDraft.status || "").toUpperCase() === "ACTIVE"
                                      : String(c.status || "").toUpperCase() === "ACTIVE"
                                  }
                                  onChange={() => handleToggleStatus(c)}
                                />
                                <span className="text-secondary" style={{ fontSize: 13 }}>
                                  {(isRowEditing && String(c.courseId) === NEW_COURSE_ID
                                    ? String(editDraft.status || "").toUpperCase() === "ACTIVE"
                                    : String(c.status || "").toUpperCase() === "ACTIVE")
                                    ? "ON"
                                    : "OFF"}
                                </span>
                              </div>
                            </td>

                            <td className="px-3 py-3 text-center">
                              {isRowEditing ? (
                                <div className="d-inline-flex align-items-center gap-2">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-link text-secondary"
                                    onClick={cancelEditRow}
                                  >
                                    <X size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-link text-success"
                                    onClick={() => saveEditRow(c.courseId)}
                                  >
                                    <Check size={16} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-link text-secondary"
                                  onClick={() => startEditRow(c)}
                                >
                                  <Pencil size={16} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="px-3 py-4 text-center text-secondary" colSpan={6}>
                          No courses found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="px-3 py-3" colSpan={6}>
                        <div className="d-flex justify-content-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-2"
                            onClick={addNewCourseRow}
                          >
                            <Plus size={16} />
                        Add New Course
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoursePage;
