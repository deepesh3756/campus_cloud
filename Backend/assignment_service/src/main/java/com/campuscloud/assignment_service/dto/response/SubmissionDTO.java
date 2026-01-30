package com.campuscloud.assignment_service.dto.response;

import com.campuscloud.assignment_service.entity.Submission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionDTO {

    private Long submissionId;
    private Long assignmentId;
    private Long studentUserId;
    private String fileName;
    private String fileUrl; // Cloudinary public URL
    private Long fileSizeBytes;
    private String mimeType;
    private Integer grade;
    private String remarks;
    private LocalDateTime submittedAt;
    private String status;

    public static SubmissionDTO fromEntity(Submission submission) {
        return SubmissionDTO.builder()
                .submissionId(submission.getSubmissionId())
                .assignmentId(submission.getAssignmentId())
                .studentUserId(submission.getStudentUserId())
                .fileName(submission.getFileName())
                .fileUrl(submission.getFilePath()) // Cloudinary URL
                .fileSizeBytes(submission.getFileSizeBytes())
                .mimeType(submission.getMimeType())
                .grade(submission.getGrade())
                .remarks(submission.getRemarks())
                .submittedAt(submission.getSubmittedAt())
                .status(submission.getStatus().name())
                .build();
    }
}
