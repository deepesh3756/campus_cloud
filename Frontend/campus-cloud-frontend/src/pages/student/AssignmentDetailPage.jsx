import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import AssignmentHeroSection from "../../components/student/AssignmentHeroSection";
import AssignmentAttachmentsSection from "../../components/student/AssignmentAttachmentsSection";
import AssignmentSubmissionSection from "../../components/student/AssignmentSubmissionSection";
import PdfViewer from "../../components/common/PdfViewer";

import sampleAssignmentPdf from "../../assets/sample-assignment.pdf";

const AssignmentDetailPage = () => {
  const { id } = useParams();
  const [submitted, setSubmitted] = useState(false);

  const assignment = useMemo(
    () => ({
      id,
      title: "Advanced Algorithms Project",
      description:
        "Design and implement a graph algorithm to solve a complex optimization problem.",
      dueDate: "2024-10-26T23:59:00",
      points: 100,
      status: submitted ? "Submitted" : "Pending",
    }),
    [id, submitted]
  );

  const attachments = useMemo(
    () => [
      {
        id: "att-1",
        name: "Project_Statement.pdf",
        type: "pdf",
        url: "#",
      },
      {
        id: "att-2",
        name: "Starter_Code.zip",
        type: "zip",
        url: "#",
      },
      {
        id: "att-3",
        name: "Rubric.docx",
        type: "docx",
        url: "#",
      },
    ],
    []
  );

  const handleSubmit = (file) => {
    console.log("Submitting assignment:", id, file);
    setSubmitted(true);
  };

  return (
    <div className="assignment-detail-page container-fluid">
      <AssignmentHeroSection
        title={assignment.title}
        description={assignment.description}
        dueDate={assignment.dueDate}
        points={assignment.points}
        status={assignment.status}
      />

      <AssignmentAttachmentsSection attachments={attachments} />

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">Preview</h5>
          <PdfViewer src={sampleAssignmentPdf} title="Assignment PDF" height={520} />
        </div>
      </div>

      <AssignmentSubmissionSection
        disabled={submitted}
        onSubmit={handleSubmit}
        onCancel={() => {
          // UI-only cancel: clears selected file in the component
        }}
      />
    </div>
  );
};

export default AssignmentDetailPage;
