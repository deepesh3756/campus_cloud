package com.campuscloud.assignment_service.repository;

import com.campuscloud.assignment_service.entity.Submission;
import com.campuscloud.assignment_service.entity.Submission.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    // Find all submissions for a specific assignment
    List<Submission> findByAssignmentId(Long assignmentId);

    // Find submissions by assignment and status
    List<Submission> findByAssignmentIdAndStatus(Long assignmentId, SubmissionStatus status);

    // Find a specific submission by assignment and student
    Optional<Submission> findByAssignmentIdAndStudentUserId(
            Long assignmentId, 
            Long studentUserId
    );

    // Find all submissions by a student
    List<Submission> findByStudentUserId(Long studentUserId);

    // Find all submissions by a student for a set of assignments
    List<Submission> findByStudentUserIdAndAssignmentIdIn(Long studentUserId, List<Long> assignmentIds);

    // Find submissions by student and status
    List<Submission> findByStudentUserIdAndStatus(Long studentUserId, SubmissionStatus status);

    // Check if student has already submitted for an assignment
    boolean existsByAssignmentIdAndStudentUserId(Long assignmentId, Long studentUserId);

    // Count submissions by assignment
    long countByAssignmentId(Long assignmentId);

    // Count submissions by assignment and status
    long countByAssignmentIdAndStatus(Long assignmentId, SubmissionStatus status);

    // Get submission rate for an assignment
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.assignmentId = :assignmentId AND s.status = 'SUBMITTED'")
    long countSubmittedByAssignmentId(@Param("assignmentId") Long assignmentId);

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.assignmentId = :assignmentId AND s.status = 'EVALUATED'")
    long countEvaluatedByAssignmentId(@Param("assignmentId") Long assignmentId);

    @Query("SELECT COUNT(s) FROM Submission s WHERE s.assignmentId = :assignmentId AND s.status = 'NOT_SUBMITTED'")
    long countPendingByAssignmentId(@Param("assignmentId") Long assignmentId);

    // Find all submissions that need evaluation
    @Query("SELECT s FROM Submission s WHERE s.assignmentId = :assignmentId AND s.status = 'SUBMITTED'")
    List<Submission> findPendingEvaluations(@Param("assignmentId") Long assignmentId);

    // Get student's submissions for specific batch-course-subject (via assignment)
    @Query("SELECT s FROM Submission s JOIN Assignment a ON s.assignmentId = a.assignmentId " +
           "WHERE s.studentUserId = :studentId AND a.batchCourseSubjectId = :bcsId")
    List<Submission> findByStudentAndBatchCourseSubject(
            @Param("studentId") Long studentId,
            @Param("bcsId") Long batchCourseSubjectId
    );

    // Find submissions with grade in a specific range
    @Query("SELECT s FROM Submission s WHERE s.assignmentId = :assignmentId AND s.grade BETWEEN :minGrade AND :maxGrade")
    List<Submission> findByAssignmentIdAndGradeRange(
            @Param("assignmentId") Long assignmentId,
            @Param("minGrade") Integer minGrade,
            @Param("maxGrade") Integer maxGrade
    );

    // Get average grade for an assignment
    @Query("SELECT AVG(s.grade) FROM Submission s WHERE s.assignmentId = :assignmentId AND s.grade IS NOT NULL")
    Double calculateAverageGrade(@Param("assignmentId") Long assignmentId);
}
