package com.campuscloud.assignment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsDTO {

    private Long assignmentId;
    private String assignmentTitle;
    
    // Submission statistics
    private long totalStudents;
    private long submittedCount;
    private long notSubmittedCount;
    private long evaluatedCount;
    private long pendingEvaluationCount;
    
    // Percentages
    private double submissionRate; // (submitted / total) * 100
    private double evaluationRate; // (evaluated / submitted) * 100
    
    // Grade statistics
    private Double averageGrade;
    private Integer highestGrade;
    private Integer lowestGrade;
    
    // Time-related
    private boolean isOverdue;
    private long daysUntilDue;
}

