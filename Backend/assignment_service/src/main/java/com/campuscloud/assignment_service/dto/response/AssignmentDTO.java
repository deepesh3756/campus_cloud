package com.campuscloud.assignment_service.dto.response;

import com.campuscloud.assignment_service.entity.Assignment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentDTO {

    private Long assignmentId;
    private Long batchCourseSubjectId;
    private Long createdByUserId;
    private String title;
    private String description;
    private String fileName;
    private String fileUrl; // Cloudinary public URL
    private String mimeType;
    private LocalDateTime dueDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Flag to indicate if assignment is overdue
    private boolean isOverdue;
    
    // Days remaining until due date (can be negative if overdue)
    private Long daysRemaining;

    public static AssignmentDTO fromEntity(Assignment assignment) {
        LocalDateTime now = LocalDateTime.now();
        long daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(now, assignment.getDueDate());
        
        return AssignmentDTO.builder()
                .assignmentId(assignment.getAssignmentId())
                .batchCourseSubjectId(assignment.getBatchCourseSubjectId())
                .createdByUserId(assignment.getCreatedByUserId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .fileName(assignment.getFileName())
                .fileUrl(assignment.getFilePath()) // This will be the Cloudinary URL
                .mimeType(assignment.getMimeType())
                .dueDate(assignment.getDueDate())
                .status(assignment.getStatus().name())
                .createdAt(assignment.getCreatedAt())
                .updatedAt(assignment.getUpdatedAt())
                .isOverdue(now.isAfter(assignment.getDueDate()))
                .daysRemaining(daysRemaining)
                .build();
    }
}

