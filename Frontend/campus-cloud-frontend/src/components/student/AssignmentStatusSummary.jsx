import AssignmentStatusCard from "./AssignmentStatusCard";

const AssignmentStatusSummary = () => {
  const pending = [
    { subject: "Mathematics", count: 3 },
    { subject: "Physics", count: 2 },
    { subject: "History", count: 1 },
    { subject: "Literature", count: 2 },
  ];

  const submitted = [
    { subject: "Chemistry", count: 4 },
    { subject: "Mathematics", count: 5 },
    { subject: "Physics", count: 3 },
  ];

  const evaluated = [
    { subject: "Mathematics", count: 2 },
    { subject: "History", count: 3 },
    { subject: "Chemistry", count: 1 },
  ];

  return (
    <div className="status-summary-grid">

      <AssignmentStatusCard
        title="Pending Assignments"
        total={8}
        data={pending}
      />

      <AssignmentStatusCard
        title="Submitted Assignments"
        total={12}
        data={submitted}
      />

      <AssignmentStatusCard
        title="Evaluated Assignments"
        total={6}
        data={evaluated}
      />

    </div>
  );
};

export default AssignmentStatusSummary;
