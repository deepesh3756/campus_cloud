import { useEffect, useMemo, useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import academicService from "../../services/api/academicService";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import { toast } from "react-toastify";

const AddSubjectPage = () => {
  const NEW_SUBJECT_ID = "__new_subject__";

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingSubjectId, setEditingSubjectId] = useState("");
  const [editDraft, setEditDraft] = useState({ subjectCode: "", subjectName: "" });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const breadcrumbItems = useMemo(() => {
    return [{ label: "Subjects", to: "/admin/subjects" }, { label: "Add / Update Subject" }];
  }, []);

  const getApiErrorMessage = (err, fallback) => {
    const apiMessage = err?.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage;
    const message = err?.message;
    if (typeof message === "string" && message.trim()) return message;
    return fallback;
  };

  const sortedSubjects = useMemo(() => {
    const list = Array.isArray(subjects) ? subjects : [];
    return [...list].sort((a, b) => {
      return String(a?.subjectCode || "").localeCompare(String(b?.subjectCode || ""));
    });
  }, [subjects]);

  const newSubjectRow = useMemo(() => {
    return (Array.isArray(sortedSubjects) ? sortedSubjects : []).find((s) => String(s?.subjectId) === NEW_SUBJECT_ID) || null;
  }, [sortedSubjects]);

  const existingSubjects = useMemo(() => {
    return (Array.isArray(sortedSubjects) ? sortedSubjects : []).filter((s) => String(s?.subjectId) !== NEW_SUBJECT_ID);
  }, [sortedSubjects]);

  useEffect(() => {
    let isMounted = true;

    const fetchSubjects = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await academicService.getSubjects();
        if (!isMounted) return;
        setSubjects(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!isMounted) return;
        setError(getApiErrorMessage(err, "Failed to load subjects"));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSubjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const startEditRow = (subject) => {
    setEditingSubjectId(String(subject.subjectId));
    setEditDraft({
      subjectCode: subject.subjectCode || "",
      subjectName: subject.subjectName || "",
    });
  };

  const cancelEditRow = () => {
    if (String(editingSubjectId) === NEW_SUBJECT_ID) {
      setSubjects((prev) => prev.filter((s) => String(s.subjectId) !== NEW_SUBJECT_ID));
    }
    setEditingSubjectId("");
    setEditDraft({ subjectCode: "", subjectName: "" });
  };

  const saveEditRow = async (subjectId) => {
    const code = String(editDraft.subjectCode || "").trim();
    const name = String(editDraft.subjectName || "").trim();
    if (!code || !name) {
      toast.error("Please provide Subject Code and Subject Name", { autoClose: 3500 });
      return;
    }

    if (String(subjectId) === NEW_SUBJECT_ID) {
      try {
        const created = await academicService.createSubject({ subjectCode: code, subjectName: name });
        setSubjects((prev) => {
          const cleaned = prev.filter((s) => String(s.subjectId) !== NEW_SUBJECT_ID);
          return [...cleaned, created];
        });
        cancelEditRow();
        toast.success("Subject created successfully", { autoClose: 2500 });
      } catch (err) {
        toast.error(getApiErrorMessage(err, "Failed to create subject"), { autoClose: 3500 });
      }
      return;
    }

    const sid = Number(subjectId);
    if (!sid) return;

    try {
      const updated = await academicService.updateSubject(sid, { subjectCode: code, subjectName: name });
      setSubjects((prev) => prev.map((s) => (s.subjectId === sid ? updated : s)));
      cancelEditRow();
      toast.success("Subject updated successfully", { autoClose: 2500 });
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update subject"), { autoClose: 3500 });
    }
  };

  const addNewSubjectRow = () => {
    if (String(editingSubjectId) === NEW_SUBJECT_ID) return;
    if (subjects.some((s) => String(s.subjectId) === NEW_SUBJECT_ID)) return;

    setSubjects((prev) => [
      ...prev,
      {
        subjectId: NEW_SUBJECT_ID,
        subjectCode: "",
        subjectName: "",
      },
    ]);
    setEditingSubjectId(NEW_SUBJECT_ID);
    setEditDraft({ subjectCode: "", subjectName: "" });
  };

  const confirmDeleteSubject = (subject) => {
    setDeleteTarget(subject);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.subjectId) return;
    if (String(deleteTarget.subjectId) === NEW_SUBJECT_ID) {
      setDeleteTarget(null);
      setSubjects((prev) => prev.filter((s) => String(s.subjectId) !== NEW_SUBJECT_ID));
      return;
    }

    setDeleting(true);
    try {
      await academicService.deleteSubject(deleteTarget.subjectId);
      setSubjects((prev) => prev.filter((s) => s.subjectId !== deleteTarget.subjectId));
      toast.success("Subject deleted successfully", { autoClose: 2500 });
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete subject"), { autoClose: 3500 });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="add-subject-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Subject"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.subjectCode || "this subject"}? This will remove related data like assignments and mappings.`
            : "Are you sure you want to delete this subject?"
        }
        loading={deleting}
        onCancel={() => (deleting ? null : setDeleteTarget(null))}
        onConfirm={handleConfirmDelete}
      />

      <div className="d-flex justify-content-center">
        <div className="card border-0 shadow-sm w-100" style={{ maxWidth: 1100, borderRadius: 14 }}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-4">
              <h4 className="fw-bold mb-0">Add / Update Subject</h4>

              <button
                type="button"
                className="btn btn-sm btn-primary d-inline-flex align-items-center gap-2"
                onClick={addNewSubjectRow}
              >
                <Plus size={16} />
                Add New Subject
              </button>
            </div>

            {error ? <div className="text-danger mb-3">{error}</div> : null}

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-center" style={{ width: 80 }}>
                      S.no
                    </th>
                    <th scope="col" className="px-3 py-3 text-center" style={{ width: 160 }}>
                      Subject Code
                    </th>
                    <th scope="col" className="px-3 py-3 text-center" style={{ minWidth: 280 }}>
                      Subject Name
                    </th>
                    <th scope="col" className="px-3 py-3 text-center" style={{ width: 140 }}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-3 py-4 text-center text-secondary" colSpan={4}>
                        Loading...
                      </td>
                    </tr>
                  ) : existingSubjects.length || newSubjectRow ? (
                    [
                      ...(newSubjectRow ? [newSubjectRow] : []),
                      ...existingSubjects,
                    ].map((s, idx) => {
                      const isRowEditing = String(editingSubjectId) === String(s.subjectId);
                      const isNew = String(s?.subjectId) === NEW_SUBJECT_ID;
                      const serialNo = isNew ? existingSubjects.length + 1 : idx + 1 - (newSubjectRow ? 1 : 0);
                      return (
                        <tr key={s.subjectId}>
                          <td className="px-3 py-3 text-center text-secondary">{serialNo}</td>

                          <td className="px-3 py-3 text-center">
                            {isRowEditing ? (
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editDraft.subjectCode}
                                onChange={(e) => setEditDraft((p) => ({ ...p, subjectCode: e.target.value }))}
                              />
                            ) : (
                              <span className="fw-semibold">{s.subjectCode}</span>
                            )}
                          </td>

                          <td className="px-3 py-3">
                            {isRowEditing ? (
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editDraft.subjectName}
                                onChange={(e) => setEditDraft((p) => ({ ...p, subjectName: e.target.value }))}
                              />
                            ) : (
                              <span className="text-secondary">{s.subjectName}</span>
                            )}
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
                                  onClick={() => saveEditRow(s.subjectId)}
                                >
                                  <Check size={16} />
                                </button>
                              </div>
                            ) : (
                              <div className="d-inline-flex align-items-center gap-3">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-link p-0 text-secondary"
                                  onClick={() => startEditRow(s)}
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-link p-0 text-danger"
                                  onClick={() => confirmDeleteSubject(s)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="px-3 py-4 text-center text-secondary" colSpan={4}>
                        No subjects found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubjectPage;
