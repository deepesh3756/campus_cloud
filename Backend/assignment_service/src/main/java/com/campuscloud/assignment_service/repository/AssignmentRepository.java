package com.campuscloud.assignment_service.repository;

import com.campuscloud.assignment_service.entity.Assignment;
import com.campuscloud.assignment_service.entity.Assignment.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    // Find all assignments for a specific batch-course-subject
    List<Assignment> findByBatchCourseSubjectId(Long batchCourseSubjectId);

    // Find assignments by batch-course-subject and status
    List<Assignment> findByBatchCourseSubjectIdAndStatus(
            Long batchCourseSubjectId, 
            AssignmentStatus status
    );

    // Find all assignments created by a specific faculty
    List<Assignment> findByCreatedByUserId(Long userId);

    // Find assignments created by faculty with specific status
    List<Assignment> findByCreatedByUserIdAndStatus(Long userId, AssignmentStatus status);

    // Find assignment with specific ID and created by specific user (for authorization)
    Optional<Assignment> findByAssignmentIdAndCreatedByUserId(
            Long assignmentId, 
            Long createdByUserId
    );

    // Check if assignment exists for batch-course-subject
    boolean existsByBatchCourseSubjectId(Long batchCourseSubjectId);

    // Count assignments by status
    long countByStatus(AssignmentStatus status);

    // Find assignments expiring soon (within next N days)
    @Query("SELECT a FROM Assignment a WHERE a.dueDate BETWEEN :now AND :futureDate AND a.status = 'ACTIVE'")
    List<Assignment> findAssignmentsExpiringSoon(
            @Param("now") LocalDateTime now,
            @Param("futureDate") LocalDateTime futureDate
    );

    // Find overdue assignments
    @Query("SELECT a FROM Assignment a WHERE a.dueDate < :now AND a.status = 'ACTIVE'")
    List<Assignment> findOverdueAssignments(@Param("now") LocalDateTime now);

    // Find active assignments for batch-course-subject ordered by due date
    List<Assignment> findByBatchCourseSubjectIdAndStatusOrderByDueDateAsc(
            Long batchCourseSubjectId,
            AssignmentStatus status
    );

    // Get assignments by faculty and batch-course-subject
    @Query("SELECT a FROM Assignment a WHERE a.createdByUserId = :facultyId AND a.batchCourseSubjectId = :bcsId")
    List<Assignment> findByFacultyAndBatchCourseSubject(
            @Param("facultyId") Long facultyId,
            @Param("bcsId") Long batchCourseSubjectId
    );
}

