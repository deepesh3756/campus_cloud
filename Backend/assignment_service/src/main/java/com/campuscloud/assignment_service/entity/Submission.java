package com.campuscloud.assignment_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "submission_id")
    private Long submissionId;

    @Column(name = "assignment_id", nullable = false)
    private Long assignmentId;

    @Column(name = "student_user_id", nullable = false)
    private Long studentUserId;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "grade")
    private Integer grade;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SubmissionStatus status = SubmissionStatus.NOT_SUBMITTED;

    public enum SubmissionStatus {
        NOT_SUBMITTED,
        SUBMITTED,
        EVALUATED
    }

    // Helper method to check if grade is valid (1-10)
    public void setGrade(Integer grade) {
        if (grade != null && (grade < 1 || grade > 10)) {
            throw new IllegalArgumentException("Grade must be between 1 and 10");
        }
        this.grade = grade;
    }
}
