package com.campuscloud.assignment_service.service;

import com.campuscloud.assignment_service.client.AcademicServiceClient;
import com.campuscloud.assignment_service.client.UserServiceClient;
import com.campuscloud.assignment_service.dto.ApiResponse;
import com.campuscloud.assignment_service.dto.request.EvaluateSubmissionRequest;
import com.campuscloud.assignment_service.dto.response.SubmissionDTO;
import com.campuscloud.assignment_service.dto.response.SubmissionWithStudentDTO;
import com.campuscloud.assignment_service.entity.Assignment;
import com.campuscloud.assignment_service.entity.Submission;
import com.campuscloud.assignment_service.exception.DeadlineExceededException;
import com.campuscloud.assignment_service.exception.ResourceNotFoundException;
import com.campuscloud.assignment_service.exception.UnauthorizedException;
import com.campuscloud.assignment_service.repository.AssignmentRepository;
import com.campuscloud.assignment_service.repository.SubmissionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Stream;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private FileValidationService fileValidationService;

    @Autowired
    private UserServiceClient userServiceClient;

    @Autowired
    private AcademicServiceClient academicServiceClient;

    /**
     * Submit assignment (student)
     */
    @Transactional
    public SubmissionDTO submitAssignment(
            Long assignmentId,
            MultipartFile file,
            Long studentUserId
    ) {
        log.info("Student {} submitting assignment {}", studentUserId, assignmentId);

        // 1. Get assignment details
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId
                ));

        // 2. Check if deadline has passed
        if (LocalDateTime.now().isAfter(assignment.getDueDate())) {
            throw new DeadlineExceededException(
                    "Assignment deadline has passed. Due date was: " + assignment.getDueDate()
            );
        }

        // 3. Check if assignment is active
        if (assignment.getStatus() != Assignment.AssignmentStatus.ACTIVE) {
            throw new IllegalStateException("Assignment is not active");
        }

        // 4. Validate file
        fileValidationService.validateSubmissionFile(file);

        // 5. Get or create submission record
        Submission submission = submissionRepository
                .findByAssignmentIdAndStudentUserId(assignmentId, studentUserId)
                .orElse(Submission.builder()
                        .assignmentId(assignmentId)
                        .studentUserId(studentUserId)
                        .status(Submission.SubmissionStatus.NOT_SUBMITTED)
                        .build());

        // 6. If resubmitting, delete old file from Cloudinary
        if (submission.getFilePath() != null && !submission.getFilePath().isEmpty()) {
            log.info("Resubmission detected, will overwrite previous file");
            // Cloudinary will overwrite with same path
        }

        // 7. Upload file to Cloudinary
        var fileResponse = cloudinaryService.uploadSubmissionFile(
                file,
                assignment.getBatchCourseSubjectId(),
                assignmentId,
                studentUserId
        );

        // 8. Update submission record
        submission.setFileName(fileResponse.getFileName());
        submission.setFilePath(fileResponse.getFileUrl());
        submission.setFileSizeBytes(fileResponse.getFileSizeBytes());
        submission.setMimeType(fileResponse.getMimeType());
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(Submission.SubmissionStatus.SUBMITTED);

        submission = submissionRepository.save(submission);

        log.info("Submission successful: submissionId={}, studentId={}", 
                submission.getSubmissionId(), studentUserId);

        return SubmissionDTO.fromEntity(submission);
    }

    /**
     * Get student's submission for a specific assignment
     */
    public SubmissionDTO getStudentSubmission(Long assignmentId, Long studentUserId) {
        log.info("Fetching submission for assignment: {}, student: {}", assignmentId, studentUserId);

        // Verify assignment exists
        assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId
                ));

        Submission submission = submissionRepository
                .findByAssignmentIdAndStudentUserId(assignmentId, studentUserId)
                .orElseGet(() -> submissionRepository.save(Submission.builder()
                        .assignmentId(assignmentId)
                        .studentUserId(studentUserId)
                        .status(Submission.SubmissionStatus.NOT_SUBMITTED)
                        .build()));

        return SubmissionDTO.fromEntity(submission);
    }

    /**
     * Evaluate a submission (faculty)
     */
    @Transactional
    public SubmissionDTO evaluateSubmission(
            Long submissionId,
            EvaluateSubmissionRequest request,
            Long facultyUserId
    ) {
        log.info("Faculty {} evaluating submission {}", facultyUserId, submissionId);

        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Submission not found with ID: " + submissionId
                ));

        Assignment assignment = assignmentRepository.findById(submission.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        // Verify faculty owns the assignment
        if (!assignment.getCreatedByUserId().equals(facultyUserId)) {
            throw new UnauthorizedException("You are not authorized to evaluate this submission");
        }

        // Can only evaluate submitted submissions
        if (submission.getStatus() != Submission.SubmissionStatus.SUBMITTED) {
            throw new IllegalStateException("Only submitted submissions can be evaluated");
        }

        submission.setGrade(request.getGrade());
        submission.setRemarks(request.getRemarks());
        submission.setStatus(Submission.SubmissionStatus.EVALUATED);

        submission = submissionRepository.save(submission);

        log.info("Submission evaluated successfully: {}", submissionId);
        return SubmissionDTO.fromEntity(submission);
    }

    /**
     * Get pending (not-submitted) assignments for a student
     */
    public List<Map<String, Object>> getPendingSubmissionsForStudent(Long studentUserId) {
        log.info("Fetching pending submissions for student: {}", studentUserId);

        List<Submission> pendingSubmissions = submissionRepository
                .findByStudentUserIdAndStatus(studentUserId, Submission.SubmissionStatus.NOT_SUBMITTED);

        if (pendingSubmissions.isEmpty()) {
            return new ArrayList<>();
        }

        List<Long> assignmentIds = pendingSubmissions.stream()
                .map(Submission::getAssignmentId)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, Assignment> assignmentsById = assignmentRepository.findAllById(assignmentIds).stream()
                .collect(Collectors.toMap(Assignment::getAssignmentId, a -> a));

        LocalDateTime now = LocalDateTime.now();

        return pendingSubmissions.stream()
                .map(submission -> {
                    Assignment assignment = assignmentsById.get(submission.getAssignmentId());
                    if (assignment == null) {
                        return null;
                    }

                    boolean isOverdue = now.isAfter(assignment.getDueDate());
                    long daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(now, assignment.getDueDate());

                    Map<String, Object> item = new HashMap<>();
                    item.put("submissionId", submission.getSubmissionId());
                    item.put("assignmentId", assignment.getAssignmentId());
                    item.put("batchCourseSubjectId", assignment.getBatchCourseSubjectId());
                    item.put("title", assignment.getTitle());
                    item.put("description", assignment.getDescription());
                    item.put("dueDate", assignment.getDueDate());
                    item.put("assignmentStatus", assignment.getStatus().name());
                    item.put("isOverdue", isOverdue);
                    item.put("daysRemaining", daysRemaining);
                    return item;
                })
                .filter(item -> item != null)
                .collect(Collectors.toList());
    }

    /**
     * Get all submissions for an assignment (faculty)
     */
    public List<SubmissionWithStudentDTO> getSubmissionsForAssignment(
            Long assignmentId,
            String status
    ) {
        log.info("Fetching submissions for assignment: {}, status: {}", assignmentId, status);

        // Verify assignment exists
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId
                ));

        List<Submission> submissions;
        if (status != null && !status.trim().isEmpty()) {
            Submission.SubmissionStatus submissionStatus = 
                    Submission.SubmissionStatus.valueOf(status.toUpperCase());
            submissions = submissionRepository.findByAssignmentIdAndStatus(
                    assignmentId, submissionStatus
            );
        } else {
            submissions = submissionRepository.findByAssignmentId(assignmentId);
        }

        // Get student details for all submissions
        return enrichSubmissionsWithStudentDetails(submissions);
    }

    /**
     * Enrich submissions with student details from User Service
     */
    private List<SubmissionWithStudentDTO> enrichSubmissionsWithStudentDetails(
            List<Submission> submissions
    ) {
        if (submissions.isEmpty()) {
            return new ArrayList<>();
        }

        // Extract student IDs
        List<Long> studentIds = submissions.stream()
                .map(Submission::getStudentUserId)
                .distinct()
                .collect(Collectors.toList());

        // Initialize map ONCE (important for lambda)
        Map<Long, Map<String, Object>> studentDetailsMap = new java.util.HashMap<>();

        try {
            ApiResponse<List<Map<String, Object>>> response =
                    userServiceClient.getBulkUserDetails(studentIds);

            if (response.isSuccess() && response.getData() != null) {
                response.getData().forEach(user -> {
                    Long userId = ((Number) user.get("userId")).longValue();
                    studentDetailsMap.put(userId, user);
                });
            } else {
                log.warn("Failed to fetch student details, returning submissions without student info");
            }
        } catch (Exception e) {
            log.error("Error fetching student details", e);
        }

        // Combine submission with student details
        return submissions.stream()
                .map(submission -> {
                    Map<String, Object> studentDetails =
                            studentDetailsMap.get(submission.getStudentUserId());

                    return SubmissionWithStudentDTO.builder()
                            .submissionId(submission.getSubmissionId())
                            .assignmentId(submission.getAssignmentId())
                            .studentUserId(submission.getStudentUserId())
                            .fileName(submission.getFileName())
                            .fileUrl(submission.getFilePath())
                            .fileSizeBytes(submission.getFileSizeBytes())
                            .mimeType(submission.getMimeType())
                            .grade(submission.getGrade())
                            .remarks(submission.getRemarks())
                            .submittedAt(submission.getSubmittedAt())
                            .status(submission.getStatus().name())
                            // Student details
                            .studentName(studentDetails != null
                                    ? studentDetails.get("firstName") + " " + studentDetails.get("lastName")
                                    : "Unknown")
                            .studentEmail(studentDetails != null
                                    ? (String) studentDetails.get("email")
                                    : null)
                            .studentPrn(studentDetails != null
                                    ? (String) studentDetails.get("prn")
                                    : null)
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Get all submissions by a student
     */
    public List<SubmissionDTO> getSubmissionsByStudent(Long studentUserId) {
        log.info("Fetching all submissions for student: {}", studentUserId);

        List<Submission> submissions = submissionRepository.findByStudentUserId(studentUserId);

        return submissions.stream()
                .map(SubmissionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Delete submission (before evaluation only)
     */
    @Transactional
    public void deleteSubmission(Long submissionId, Long studentUserId) {
        log.info("Student {} attempting to delete submission {}", studentUserId, submissionId);

        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Submission not found with ID: " + submissionId
                ));

        // Verify student owns the submission
        if (!submission.getStudentUserId().equals(studentUserId)) {
            throw new UnauthorizedException(
                    "You are not authorized to delete this submission"
            );
        }

        // Can only delete if not yet evaluated
        if (submission.getStatus() == Submission.SubmissionStatus.EVALUATED) {
            throw new IllegalStateException(
                    "Cannot delete an evaluated submission"
            );
        }

        // Delete file from Cloudinary (if exists)
        if (submission.getFilePath() != null && !submission.getFilePath().isEmpty()) {
            // Extract public ID from URL and delete
            // Note: You might need to store public_id separately for easier deletion
        }

        // Reset submission to NOT_SUBMITTED
        submission.setFileName(null);
        submission.setFilePath(null);
        submission.setFileSizeBytes(null);
        submission.setMimeType(null);
        submission.setSubmittedAt(null);
        submission.setStatus(Submission.SubmissionStatus.NOT_SUBMITTED);

        submissionRepository.save(submission);

        log.info("Submission deleted successfully: {}", submissionId);
    }

    /**
     * Generate download URL for submission file
     */
    public String generateDownloadUrl(Long submissionId, Long requestingUserId, String userRole) {
        log.info("Generating download URL for submission: {}", submissionId);

        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Submission not found with ID: " + submissionId
                ));

        // Authorization check
        if ("ADMIN".equals(userRole)) {
            // Admins can download any submission
            log.info("Admin user {} downloading submission: {}", requestingUserId, submissionId);
        } else if ("STUDENT".equals(userRole)) {
            // Students can only download their own submissions
            if (!submission.getStudentUserId().equals(requestingUserId)) {
                throw new UnauthorizedException(
                        "You are not authorized to download this submission"
                );
            }
        } else if ("FACULTY".equals(userRole)) {
            // Faculty can download if they are assigned to the batch-course-subject
            Assignment assignment = assignmentRepository.findById(submission.getAssignmentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Assignment not found"
                    ));

            // Validate faculty is assigned to this subject
            try {
                ApiResponse<Boolean> response = academicServiceClient
                        .validateFacultySubject(requestingUserId, assignment.getBatchCourseSubjectId());

                if (!response.isSuccess() || !Boolean.TRUE.equals(response.getData())) {
                    throw new UnauthorizedException(
                            "You are not authorized to download this submission. You must be assigned to this subject."
                    );
                }
            } catch (UnauthorizedException e) {
                throw e;
            } catch (Exception e) {
                log.error("Failed to validate faculty assignment: faculty={}, bcs={}",
                        requestingUserId, assignment.getBatchCourseSubjectId(), e);
                throw new UnauthorizedException(
                        "Failed to validate faculty assignment: " + e.getMessage()
                );
            }
        }

        // Generate signed URL (extract public ID from full URL)
        // For now, return the direct URL
        // In production, you should extract public_id and use cloudinaryService.generateDownloadUrl()
        
        return submission.getFilePath();
    }
}
