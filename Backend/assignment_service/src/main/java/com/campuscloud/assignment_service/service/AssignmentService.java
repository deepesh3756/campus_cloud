package com.campuscloud.assignment_service.service;

import com.campuscloud.assignment_service.client.AcademicServiceClient;
import com.campuscloud.assignment_service.client.UserServiceClient;
import com.campuscloud.assignment_service.dto.ApiResponse;
import com.campuscloud.assignment_service.dto.request.CreateAssignmentRequest;
import com.campuscloud.assignment_service.dto.response.AssignmentDTO;
import com.campuscloud.assignment_service.dto.response.FileUploadResponse;
import com.campuscloud.assignment_service.entity.Assignment;
import com.campuscloud.assignment_service.entity.Submission;
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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private FileValidationService fileValidationService;

    @Autowired
    private AcademicServiceClient academicServiceClient;

    @Autowired
    private UserServiceClient userServiceClient;

    /**
     * Create new assignment with file upload
     */
    @Transactional
    public AssignmentDTO createAssignment(
            CreateAssignmentRequest request,
            MultipartFile file,
            Long facultyUserId
    ) {
        log.info("Creating assignment: {} by faculty: {}", request.getTitle(), facultyUserId);

        // 1. Validate batch-course-subject exists
        validateBatchCourseSubject(request.getBatchCourseSubjectId());

        // 2. Validate faculty is assigned to this subject
        validateFacultyAssignment(facultyUserId, request.getBatchCourseSubjectId());

        boolean hasFile = file != null && !file.isEmpty();

        // 3. Validate file (optional)
        if (hasFile) {
            fileValidationService.validateAssignmentFile(file);
        }

        // 4. Create assignment entity (without file info first)
        Assignment assignment = Assignment.builder()
                .batchCourseSubjectId(request.getBatchCourseSubjectId())
                .createdByUserId(facultyUserId)
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .status(Assignment.AssignmentStatus.ACTIVE)
                .fileName(hasFile ? "temp" : "")
                .filePath(hasFile ? "temp" : "")
                .mimeType(hasFile ? "temp" : "")
                .build();

        // 5. Save to get assignment ID
        assignment = assignmentRepository.save(assignment);
        log.info("Assignment created with ID: {}", assignment.getAssignmentId());

        // 6. Upload file to Cloudinary (optional)
        if (hasFile) {
            FileUploadResponse fileResponse = cloudinaryService.uploadAssignmentFile(
                    file,
                    request.getBatchCourseSubjectId(),
                    assignment.getAssignmentId()
            );

            // 7. Update assignment with file information
            assignment.setFileName(fileResponse.getFileName());
            assignment.setFilePath(fileResponse.getFileUrl());
            assignment.setMimeType(fileResponse.getMimeType());
            assignment = assignmentRepository.save(assignment);
        }

        // 8. Create submission records for all enrolled students
        createSubmissionRecordsForStudents(assignment.getAssignmentId(), request.getBatchCourseSubjectId());

        log.info("Assignment created successfully: {}", assignment.getAssignmentId());
        return AssignmentDTO.fromEntity(assignment);
    }

    /**
     * Create submission records for all enrolled students
     */
    private void createSubmissionRecordsForStudents(Long assignmentId, Long batchCourseSubjectId) {
        try {
            // Get enrolled student IDs from Academic Service
            ApiResponse<List<Long>> response = academicServiceClient
                    .getEnrolledStudentIds(batchCourseSubjectId);

            if (response.isSuccess() && response.getData() != null) {
                List<Long> studentIds = response.getData();
                log.info("Creating submission records for {} students", studentIds.size());

                List<Submission> submissions = studentIds.stream()
                        .map(studentId -> Submission.builder()
                                .assignmentId(assignmentId)
                                .studentUserId(studentId)
                                .status(Submission.SubmissionStatus.NOT_SUBMITTED)
                                .build())
                        .collect(Collectors.toList());

                submissionRepository.saveAll(submissions);
                log.info("Created {} submission records", submissions.size());
            }
        } catch (Exception e) {
            log.error("Failed to create submission records for assignment: {}", assignmentId, e);
            // Don't throw exception - assignment is already created
        }
    }

    /**
     * Get all assignments for a batch-course-subject
     */
    public List<AssignmentDTO> getAssignmentsBySubject(Long batchCourseSubjectId, String status) {
        log.info("Fetching assignments for BCS: {}, status: {}", batchCourseSubjectId, status);

        List<Assignment> assignments;
        if (status != null && !status.trim().isEmpty()) {
            Assignment.AssignmentStatus assignmentStatus = Assignment.AssignmentStatus.valueOf(status.toUpperCase());
            assignments = assignmentRepository.findByBatchCourseSubjectIdAndStatus(
                    batchCourseSubjectId, assignmentStatus
            );
        } else {
            assignments = assignmentRepository.findByBatchCourseSubjectId(batchCourseSubjectId);
        }

        return assignments.stream()
                .map(AssignmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Update assignment details (faculty)
     */
    @Transactional
    public AssignmentDTO updateAssignment(
            Long assignmentId,
            CreateAssignmentRequest request,
            MultipartFile file,
            Long facultyUserId
    ) {
        log.info("Updating assignment: {} by faculty: {}", assignmentId, facultyUserId);

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId
                ));

        if (!assignment.getCreatedByUserId().equals(facultyUserId)) {
            throw new UnauthorizedException(
                    "You are not authorized to modify this assignment"
            );
        }

        Long bcsId = assignment.getBatchCourseSubjectId();

        validateBatchCourseSubject(bcsId);
        validateFacultyAssignment(facultyUserId, bcsId);

        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setDueDate(request.getDueDate());

        boolean hasFile = file != null && !file.isEmpty();
        if (hasFile) {
            fileValidationService.validateAssignmentFile(file);
            FileUploadResponse fileResponse = cloudinaryService.uploadAssignmentFile(
                    file,
                    bcsId,
                    assignment.getAssignmentId()
            );
            assignment.setFileName(fileResponse.getFileName());
            assignment.setFilePath(fileResponse.getFileUrl());
            assignment.setMimeType(fileResponse.getMimeType());
        }

        assignment = assignmentRepository.save(assignment);
        log.info("Assignment updated successfully: {}", assignmentId);
        return AssignmentDTO.fromEntity(assignment);
    }

    /**
     * Get assignment details by ID
     */
    public AssignmentDTO getAssignmentById(Long assignmentId) {
        log.info("Fetching assignment: {}", assignmentId);
        
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId
                ));

        return AssignmentDTO.fromEntity(assignment);
    }

    /**
     * Get all assignments created by a faculty
     */
    public List<AssignmentDTO> getAssignmentsByFaculty(Long facultyId) {
        log.info("Fetching assignments for faculty: {}", facultyId);
        
        List<Assignment> assignments = assignmentRepository.findByCreatedByUserId(facultyId);
        return assignments.stream()
                .map(AssignmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Update assignment status
     */
    @Transactional
    public AssignmentDTO updateAssignmentStatus(
            Long assignmentId,
            String status,
            Long facultyUserId
    ) {
        log.info("Updating assignment {} status to: {}", assignmentId, status);

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId
                ));

        // Verify faculty owns this assignment
        if (!assignment.getCreatedByUserId().equals(facultyUserId)) {
            throw new UnauthorizedException(
                    "You are not authorized to modify this assignment"
            );
        }

        assignment.setStatus(Assignment.AssignmentStatus.valueOf(status.toUpperCase()));
        assignment = assignmentRepository.save(assignment);

        log.info("Assignment status updated successfully");
        return AssignmentDTO.fromEntity(assignment);
    }

    /**
     * Delete assignment (soft delete by setting status to INACTIVE)
     */
    @Transactional
    public void deleteAssignment(Long assignmentId, Long facultyUserId) {
        log.info("Deleting assignment: {} by faculty: {}", assignmentId, facultyUserId);

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId
                ));

        // Verify faculty owns this assignment
        if (!assignment.getCreatedByUserId().equals(facultyUserId)) {
            throw new UnauthorizedException(
                    "You are not authorized to delete this assignment"
            );
        }

        // Soft delete
        assignment.setStatus(Assignment.AssignmentStatus.INACTIVE);
        assignmentRepository.save(assignment);

        log.info("Assignment deleted (soft) successfully");
    }

    /**
     * Get expired assignments and mark them
     */
    @Transactional
    public void markExpiredAssignments() {
        LocalDateTime now = LocalDateTime.now();
        List<Assignment> overdueAssignments = assignmentRepository.findOverdueAssignments(now);

        log.info("Found {} overdue assignments to mark as expired", overdueAssignments.size());

        overdueAssignments.forEach(assignment -> {
            assignment.setStatus(Assignment.AssignmentStatus.EXPIRED);
        });

        assignmentRepository.saveAll(overdueAssignments);
        log.info("Marked {} assignments as expired", overdueAssignments.size());
    }

    /**
     * Get assignments expiring soon (within next N days)
     */
    public List<AssignmentDTO> getAssignmentsExpiringSoon(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime futureDate = now.plusDays(days);

        List<Assignment> assignments = assignmentRepository.findAssignmentsExpiringSoon(now, futureDate);

        return assignments.stream()
                .map(AssignmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ==================== VALIDATION METHODS ====================

    /**
     * Validate that batch-course-subject exists
     */
    private void validateBatchCourseSubject(Long batchCourseSubjectId) {
        try {
            ApiResponse<Map<String, Object>> response = academicServiceClient
                    .getBatchCourseSubjectDetails(batchCourseSubjectId);

            if (!response.isSuccess() || response.getData() == null) {
                throw new ResourceNotFoundException(
                        "Batch-Course-Subject not found with ID: " + batchCourseSubjectId
                );
            }
        } catch (Exception e) {
            log.error("Failed to validate batch-course-subject: {}", batchCourseSubjectId, e);
            throw new ResourceNotFoundException(
                    "Failed to validate batch-course-subject: " + e.getMessage()
            );
        }
    }

    /**
     * Validate that faculty is assigned to this subject
     */
    private void validateFacultyAssignment(Long facultyId, Long batchCourseSubjectId) {
        try {
            ApiResponse<Boolean> response = academicServiceClient
                    .validateFacultySubject(facultyId, batchCourseSubjectId);

            if (!response.isSuccess() || !Boolean.TRUE.equals(response.getData())) {
                throw new UnauthorizedException(
                        "Faculty is not assigned to this subject"
                );
            }
        } catch (UnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to validate faculty assignment: faculty={}, bcs={}",
                    facultyId, batchCourseSubjectId, e);
            throw new UnauthorizedException(
                    "Failed to validate faculty assignment: " + e.getMessage()
            );
        }
    }

    /**
     * Check if assignment is overdue
     */
    public boolean isAssignmentOverdue(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId
                ));

        return LocalDateTime.now().isAfter(assignment.getDueDate());
    }
}

