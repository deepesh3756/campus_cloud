package com.campuscloud.assignment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionWithStudentDTO {

    // Submission details
    private Long submissionId;
    private Long assignmentId;
    private Long studentUserId;
    private String fileName;
    private String fileUrl;
    private Long fileSizeBytes;
    private String mimeType;
    private Integer grade;
    private String remarks;
    private LocalDateTime submittedAt;
    private String status;

    // Student details (from User Service)
    private String studentName;
    private String studentEmail;
    private String studentPrn;
}
