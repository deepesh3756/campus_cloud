package com.campuscloud.assignment_service.service;

import com.campuscloud.assignment_service.client.AcademicServiceClient;
import com.campuscloud.assignment_service.dto.ApiResponse;
import com.campuscloud.assignment_service.dto.response.AnalyticsDTO;
import com.campuscloud.assignment_service.entity.Assignment;
import com.campuscloud.assignment_service.entity.Submission;
import com.campuscloud.assignment_service.exception.ResourceNotFoundException;
import com.campuscloud.assignment_service.repository.AssignmentRepository;
import com.campuscloud.assignment_service.repository.SubmissionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Slf4j
public class AnalyticsService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AcademicServiceClient academicServiceClient;

    /**
     * Get comprehensive analytics for an assignment
     */
    public AnalyticsDTO getAssignmentAnalytics(Long assignmentId) {
        log.info("Calculating analytics for assignment: {}", assignmentId);

        // 1. Get assignment details
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId
                ));

        // 2. Get total enrolled students count
        long totalStudents = getTotalStudentsForAssignment(assignmentId, assignment.getBatchCourseSubjectId());

        // 3. Get submission counts by status
        long submittedCount = submissionRepository.countSubmittedByAssignmentId(assignmentId);
        long evaluatedCount = submissionRepository.countEvaluatedByAssignmentId(assignmentId);
        long notSubmittedCount = submissionRepository.countPendingByAssignmentId(assignmentId);

        // 4. Calculate rates
        double submissionRate = totalStudents > 0 ? 
                (submittedCount + evaluatedCount) * 100.0 / totalStudents : 0.0;
        
        double evaluationRate = submittedCount > 0 ? 
                evaluatedCount * 100.0 / submittedCount : 0.0;

        // 5. Calculate grade statistics
        Double averageGrade = submissionRepository.calculateAverageGrade(assignmentId);
        Integer highestGrade = getHighestGrade(assignmentId);
        Integer lowestGrade = getLowestGrade(assignmentId);

        // 6. Calculate time-related metrics
        LocalDateTime now = LocalDateTime.now();
        boolean isOverdue = now.isAfter(assignment.getDueDate());
        long daysUntilDue = ChronoUnit.DAYS.between(now, assignment.getDueDate());

        // 7. Build analytics DTO
        return AnalyticsDTO.builder()
                .assignmentId(assignmentId)
                .assignmentTitle(assignment.getTitle())
                .totalStudents(totalStudents)
                .submittedCount(submittedCount)
                .notSubmittedCount(notSubmittedCount)
                .evaluatedCount(evaluatedCount)
                .pendingEvaluationCount(submittedCount - evaluatedCount)
                .submissionRate(Math.round(submissionRate * 100.0) / 100.0)
                .evaluationRate(Math.round(evaluationRate * 100.0) / 100.0)
                .averageGrade(averageGrade != null ? Math.round(averageGrade * 100.0) / 100.0 : null)
                .highestGrade(highestGrade)
                .lowestGrade(lowestGrade)
                .isOverdue(isOverdue)
                .daysUntilDue(daysUntilDue)
                .build();
    }

    /**
     * Get total enrolled students for a batch-course-subject
     */
    private long getTotalStudentsForAssignment(Long assignmentId, Long batchCourseSubjectId) {
        long submissionRecords = 0;
        try {
            submissionRecords = submissionRepository.countByAssignmentId(assignmentId);
        } catch (Exception e) {
            log.error("Failed to count submission records for assignment: {}", assignmentId, e);
        }

        long enrolledCount = 0;
        try {
            ApiResponse<List<Long>> response = academicServiceClient
                    .getEnrolledStudentIds(batchCourseSubjectId);

            if (response.isSuccess() && response.getData() != null) {
                enrolledCount = response.getData().size();
            }
        } catch (Exception e) {
            log.error("Failed to get enrolled students count for BCS: {}", 
                    batchCourseSubjectId, e);
        }

        return Math.max(enrolledCount, submissionRecords);
    }

    /**
     * Get highest grade for an assignment
     */
    private Integer getHighestGrade(Long assignmentId) {
        List<Submission> evaluatedSubmissions = submissionRepository
                .findByAssignmentIdAndGradeRange(assignmentId, 1, 10);

        return evaluatedSubmissions.stream()
                .map(Submission::getGrade)
                .filter(grade -> grade != null)
                .max(Integer::compareTo)
                .orElse(null);
    }

    /**
     * Get lowest grade for an assignment
     */
    private Integer getLowestGrade(Long assignmentId) {
        List<Submission> evaluatedSubmissions = submissionRepository
                .findByAssignmentIdAndGradeRange(assignmentId, 1, 10);

        return evaluatedSubmissions.stream()
                .map(Submission::getGrade)
                .filter(grade -> grade != null)
                .min(Integer::compareTo)
                .orElse(null);
    }

    /**
     * Get grade distribution for an assignment
     */
    public List<GradeDistribution> getGradeDistribution(Long assignmentId) {
        log.info("Calculating grade distribution for assignment: {}", assignmentId);

        // Define grade ranges
        List<GradeDistribution> distribution = List.of(
                new GradeDistribution("Excellent (9-10)", 
                        submissionRepository.findByAssignmentIdAndGradeRange(assignmentId, 9, 10).size()),
                new GradeDistribution("Very Good (7-8)", 
                        submissionRepository.findByAssignmentIdAndGradeRange(assignmentId, 7, 8).size()),
                new GradeDistribution("Good (5-6)", 
                        submissionRepository.findByAssignmentIdAndGradeRange(assignmentId, 5, 6).size()),
                new GradeDistribution("Average (3-4)", 
                        submissionRepository.findByAssignmentIdAndGradeRange(assignmentId, 3, 4).size()),
                new GradeDistribution("Below Average (1-2)", 
                        submissionRepository.findByAssignmentIdAndGradeRange(assignmentId, 1, 2).size())
        );

        return distribution;
    }

    /**
     * Get submission timeline (submissions per day)
     */
    public List<SubmissionTimeline> getSubmissionTimeline(Long assignmentId) {
        log.info("Calculating submission timeline for assignment: {}", assignmentId);

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId
                ));

        List<Submission> submissions = submissionRepository.findByAssignmentId(assignmentId);

        // Group submissions by date
        var submissionsByDate = submissions.stream()
                .filter(s -> s.getSubmittedAt() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        s -> s.getSubmittedAt().toLocalDate(),
                        java.util.stream.Collectors.counting()
                ));

        return submissionsByDate.entrySet().stream()
                .map(entry -> new SubmissionTimeline(entry.getKey(), entry.getValue()))
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Get overall statistics for a faculty
     */
    public FacultyStatistics getFacultyStatistics(Long facultyId) {
        log.info("Calculating statistics for faculty: {}", facultyId);

        List<Assignment> assignments = assignmentRepository.findByCreatedByUserId(facultyId);

        long totalAssignments = assignments.size();
        long activeAssignments = assignments.stream()
                .filter(a -> a.getStatus() == Assignment.AssignmentStatus.ACTIVE)
                .count();
        
        long expiredAssignments = assignments.stream()
                .filter(a -> a.getStatus() == Assignment.AssignmentStatus.EXPIRED)
                .count();

        // Calculate total submissions across all assignments
        long totalSubmissions = assignments.stream()
                .mapToLong(a -> submissionRepository.countSubmittedByAssignmentId(a.getAssignmentId()))
                .sum();

        long totalEvaluations = assignments.stream()
                .mapToLong(a -> submissionRepository.countEvaluatedByAssignmentId(a.getAssignmentId()))
                .sum();

        long pendingEvaluations = totalSubmissions - totalEvaluations;

        return FacultyStatistics.builder()
                .facultyId(facultyId)
                .totalAssignments(totalAssignments)
                .activeAssignments(activeAssignments)
                .expiredAssignments(expiredAssignments)
                .totalSubmissions(totalSubmissions)
                .totalEvaluations(totalEvaluations)
                .pendingEvaluations(pendingEvaluations)
                .build();
    }

    // ==================== INNER CLASSES ====================

    @lombok.Data
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    public static class GradeDistribution {
        private String range;
        private long count;
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    public static class SubmissionTimeline {
        private java.time.LocalDate date;
        private long count;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    public static class FacultyStatistics {
        private Long facultyId;
        private long totalAssignments;
        private long activeAssignments;
        private long expiredAssignments;
        private long totalSubmissions;
        private long totalEvaluations;
        private long pendingEvaluations;
    }
}
