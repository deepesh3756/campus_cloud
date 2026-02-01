import AssignmentStatusCard from "./AssignmentStatusCard";
import { useEffect, useMemo, useState } from "react";
import { assignmentService } from "../../services/api/assignmentService";

const AssignmentStatusSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await assignmentService.getStudentStatusSummary();
        if (mounted) {
          setSummary(data);
        }
      } catch (e) {
        if (mounted) {
          setError(e);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const pendingData = useMemo(() => {
    const subjects = summary?.pending?.subjects ?? [];
    return subjects.map((s) => ({
      subject: s.subjectName ?? s.subjectCode ?? "",
      count: s.count ?? 0,
    }));
  }, [summary]);

  const submittedData = useMemo(() => {
    const subjects = summary?.submitted?.subjects ?? [];
    return subjects.map((s) => ({
      subject: s.subjectName ?? s.subjectCode ?? "",
      count: s.count ?? 0,
    }));
  }, [summary]);

  const evaluatedData = useMemo(() => {
    const subjects = summary?.evaluated?.subjects ?? [];
    return subjects.map((s) => ({
      subject: s.subjectName ?? s.subjectCode ?? "",
      count: s.count ?? 0,
    }));
  }, [summary]);

  if (loading) {
    return <div className="py-4">Loading...</div>;
  }

  if (error) {
    return <div className="py-4">Failed to load assignment summary</div>;
  }

  return (
    <div className="status-summary-grid">

      <AssignmentStatusCard
        title="Pending"
        total={summary?.pending?.total ?? 0}
        data={pendingData}
      />

      <AssignmentStatusCard
        title="Submitted"
        total={summary?.submitted?.total ?? 0}
        data={submittedData}
      />

      <AssignmentStatusCard
        title="Evaluated  "
        total={summary?.evaluated?.total ?? 0}
        data={evaluatedData}
      />

    </div>
  );
};

export default AssignmentStatusSummary;
