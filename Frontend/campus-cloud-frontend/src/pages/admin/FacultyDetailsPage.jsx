import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, User } from "lucide-react";
import AdminBreadcrumb from "../../components/common/AdminBreadcrumb";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";
import academicService from "../../services/api/academicService";
import userService from "../../services/api/userService";
import { toast } from "react-toastify";

const FacultyDetailsPage = () => {
  const navigate = useNavigate();
  const { facultyId } = useParams();

  const parsedUserId = useMemo(() => {
    const n = Number(facultyId);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [facultyId]);

  const [profile, setProfile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!parsedUserId) return;
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [p, a] = await Promise.all([
          userService.getUserProfile(parsedUserId),
          academicService.getSubjectsByFaculty(parsedUserId),
        ]);
        if (!isMounted) return;
        setProfile(p);
        setAssignments(Array.isArray(a) ? a : []);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.response?.data?.message || err?.message || "Failed to load faculty details");
        setProfile(null);
        setAssignments([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [parsedUserId]);

  const batches = useMemo(() => {
    const set = new Set(
      (Array.isArray(assignments) ? assignments : [])
        .map((a) => a.batchName)
        .filter(Boolean)
    );
    return Array.from(set);
  }, [assignments]);

  const courses = useMemo(() => {
    const set = new Set(
      (Array.isArray(assignments) ? assignments : [])
        .map((a) => a.courseCode)
        .filter(Boolean)
    );
    return Array.from(set);
  }, [assignments]);

  const breadcrumbItems = useMemo(() => {
    const label = profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() : "Faculty";
    return [{ label: "Faculty", to: "/admin/faculty/manage" }, { label }];
  }, [profile]);

  const handleDelete = async () => {
    if (!parsedUserId) return;
    setDeleting(true);
    try {
      await userService.updateUserStatus(parsedUserId, "INACTIVE");
      toast.success("Faculty marked as INACTIVE", { autoClose: 2500 });
      navigate("/admin/faculty/manage");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete faculty", { autoClose: 3500 });
    } finally {
      setDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  if (!parsedUserId) {
    return (
      <div className="faculty-details-page">
        <AdminBreadcrumb items={[{ label: "Faculty", to: "/admin/faculty/manage" }, { label: "Faculty" }]} />
        <div className="text-secondary">Invalid faculty id.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="faculty-details-page">
        <AdminBreadcrumb items={[{ label: "Faculty", to: "/admin/faculty/manage" }, { label: "Faculty" }]} />
        <div className="text-secondary">Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="faculty-details-page">
        <AdminBreadcrumb items={[{ label: "Faculty", to: "/admin/faculty/manage" }, { label: "Faculty" }]} />
        <div className="text-secondary">{error || "Faculty not found."}</div>
      </div>
    );
  }

  return (
    <div className="faculty-details-page">
      <AdminBreadcrumb items={breadcrumbItems} />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        title="Delete Faculty"
        message="Are you sure you want to delete this faculty? This will mark the faculty as INACTIVE."
        confirmText="Yes, Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />

      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
        <h4 className="fw-bold mb-0">Faculty details</h4>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-light border d-inline-flex align-items-center gap-2"
            onClick={() => navigate(`/admin/faculty/${facultyId}/edit`)}
          >
            <Pencil size={16} />
            Edit faculty
          </button>
          <button
            type="button"
            className="btn btn-danger d-inline-flex align-items-center gap-2"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 size={16} />
            Delete Faculty
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-start justify-content-between gap-4 flex-wrap">
            <div style={{ minWidth: 280 }}>
              <h5 className="fw-bold mb-3">Faculty Information</h5>

              <div className="mb-3">
                <div className="text-secondary" style={{ fontSize: 12 }}>
                  Faculty code
                </div>
                <div className="fw-semibold">{profile.userId}</div>
              </div>

              <div className="mb-3">
                <div className="text-secondary" style={{ fontSize: 12 }}>
                  Faculty Full Name
                </div>
                <div className="fw-semibold">
                  {profile.firstName} {profile.lastName}
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Email
                  </div>
                  <div className="fw-semibold">{profile.email}</div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Batch(s)
                  </div>
                  <div className="fw-semibold">{batches.join(", ") || "-"}</div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Mobile
                  </div>
                  <div className="fw-semibold">{profile.mobile}</div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Course
                  </div>
                  <div className="fw-semibold">{courses.join(", ") || "-"}</div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="text-secondary" style={{ fontSize: 12 }}>
                    Gender
                  </div>
                  <div className="fw-semibold">{profile.gender}</div>
                </div>
              </div>
            </div>

            <div
              className="d-flex align-items-center justify-content-center border"
              style={{ width: 140, height: 110, borderRadius: 12, background: "#f3f4f6" }}
            >
              {profile.profilePictureUrl ? (
                <img
                  src={profile.profilePictureUrl}
                  alt="profile"
                  style={{ width: 110, height: 110, objectFit: "cover", borderRadius: 12 }}
                />
              ) : (
                <User size={36} className="text-secondary" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetailsPage;
