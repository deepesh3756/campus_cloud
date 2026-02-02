package com.campuscloud.assignment_service.service;

import com.campuscloud.assignment_service.client.AcademicServiceClient;
import com.campuscloud.assignment_service.client.UserServiceClient;
import com.campuscloud.assignment_service.dto.ApiResponse;
import com.campuscloud.assignment_service.dto.request.CreateAssignmentRequest;
import com.campuscloud.assignment_service.dto.response.AssignmentDTO;
import com.campuscloud.assignment_service.dto.response.FileUploadResponse;
import com.campuscloud.assignment_service.entity.Assignment;
import com.campuscloud.assignment_service.entity.Submission;
import com.campuscloud.assignment_service.event.AssignmentCreatedEvent;
import com.campuscloud.assignment_service.event.EventPublisher;
import com.campuscloud.assignment_service.exception.ResourceNotFoundException;
import com.campuscloud.assignment_service.exception.UnauthorizedException;
import com.campuscloud.assignment_service.repository.AssignmentRepository;
import com.campuscloud.assignment_service.repository.SubmissionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URL;
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

    @Autowired
    private EventPublisher eventPublisher;

    /**
     * Create new assignment with file upload
     */
    @Transactional
    public AssignmentDTO createAssignment(
            CreateAssignmentRequest request,
            MultipartFile file,
            Long userId,
            boolean isAdmin) {
        log.info("Creating assignment: {} by user: {} (admin={})", request.getTitle(), userId, isAdmin);

        // 1. Validate batch-course-subject exists
        validateBatchCourseSubject(request.getBatchCourseSubjectId());

        // 2. Validate faculty is assigned to this subject
        if (!isAdmin) {
            validateFacultyAssignment(userId, request.getBatchCourseSubjectId());
        }

        boolean hasFile = file != null && !file.isEmpty();

        // 3. Validate file (optional)
        if (hasFile) {
            fileValidationService.validateAssignmentFile(file);
        }

        // 4. Create assignment entity (without file info first)
        Assignment assignment = Assignment.builder()
                .batchCourseSubjectId(request.getBatchCourseSubjectId())
                .createdByUserId(userId)
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
                    assignment.getAssignmentId());

            // 7. Update assignment with file information
            assignment.setFileName(fileResponse.getFileName());
            assignment.setFilePath(fileResponse.getFileUrl());
            assignment.setMimeType(fileResponse.getMimeType());
            assignment = assignmentRepository.save(assignment);
        }

        // 8. Create submission records for all enrolled students
        createSubmissionRecordsForStudents(assignment.getAssignmentId(), request.getBatchCourseSubjectId());

        // 9. Publish event to RabbitMQ for notifications
        publishAssignmentCreatedEvent(assignment, userId);

        log.info("Assignment created successfully: {}", assignment.getAssignmentId());
        return AssignmentDTO.fromEntity(assignment);
    }

    public static class AssignmentFileContent {
        private final byte[] bytes;
        private final String fileName;
        private final String mimeType;

        public AssignmentFileContent(byte[] bytes, String fileName, String mimeType) {
            this.bytes = bytes;
            this.fileName = fileName;
            this.mimeType = mimeType;
        }

        public byte[] getBytes() {
            return bytes;
        }

        public String getFileName() {
            return fileName;
        }

        public String getMimeType() {
            return mimeType;
        }
    }

    public AssignmentFileContent getAssignmentFileContent(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId));

        String url = assignment.getFilePath();
        if (url == null || url.trim().isEmpty()) {
            throw new ResourceNotFoundException("No attachment found for assignment: " + assignmentId);
        }

        try (InputStream in = new URL(url).openStream()) {
            byte[] bytes = in.readAllBytes();
            return new AssignmentFileContent(bytes, assignment.getFileName(), assignment.getMimeType());
        } catch (Exception e) {
            log.error("Failed to fetch assignment file content for assignment: {}", assignmentId, e);
            throw new ResourceNotFoundException("Failed to fetch assignment attachment");
        }
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
                    batchCourseSubjectId, assignmentStatus);
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
            Long userId,
            boolean isAdmin) {
        log.info("Updating assignment: {} by user: {} (admin={})", assignmentId, userId, isAdmin);

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId));

        if (!isAdmin && !assignment.getCreatedByUserId().equals(userId)) {
            throw new UnauthorizedException(
                    "You are not authorized to modify this assignment");
        }

        Long bcsId = assignment.getBatchCourseSubjectId();

        validateBatchCourseSubject(bcsId);
        if (!isAdmin) {
            validateFacultyAssignment(userId, bcsId);
        }

        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setDueDate(request.getDueDate());

        boolean hasFile = file != null && !file.isEmpty();
        if (hasFile) {
            fileValidationService.validateAssignmentFile(file);
            FileUploadResponse fileResponse = cloudinaryService.uploadAssignmentFile(
                    file,
                    bcsId,
                    assignment.getAssignmentId());
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
                        "Assignment not found with ID: " + assignmentId));

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
            Long userId,
            boolean isAdmin) {
        log.info("Updating assignment {} status to: {}", assignmentId, status);

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId));

        // Verify faculty owns this assignment
        if (!isAdmin && !assignment.getCreatedByUserId().equals(userId)) {
            throw new UnauthorizedException(
                    "You are not authorized to modify this assignment");
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
        deleteAssignment(assignmentId, facultyUserId, false);
    }

    @Transactional
    public void deleteAssignment(Long assignmentId, Long userId, boolean isAdmin) {
        log.info("Deleting assignment: {} by user: {} (admin={})", assignmentId, userId, isAdmin);

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId));

        // Verify faculty owns this assignment
        if (!isAdmin && !assignment.getCreatedByUserId().equals(userId)) {
            throw new UnauthorizedException(
                    "You are not authorized to delete this assignment");
        }

        // Soft delete
        assignment.setStatus(Assignment.AssignmentStatus.INACTIVE);
        assignmentRepository.save(assignment);

        log.info("Assignment deleted (soft) successfully");
    }

    public List<AssignmentDTO> getAllAssignments() {
        return assignmentRepository.findAll().stream()
                .map(AssignmentDTO::fromEntity)
                .collect(Collectors.toList());
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
                        "Batch-Course-Subject not found with ID: " + batchCourseSubjectId);
            }
        } catch (Exception e) {
            log.error("Failed to validate batch-course-subject: {}", batchCourseSubjectId, e);
            throw new ResourceNotFoundException(
                    "Failed to validate batch-course-subject: " + e.getMessage());
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
                        "Faculty is not assigned to this subject");
            }
        } catch (UnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to validate faculty assignment: faculty={}, bcs={}",
                    facultyId, batchCourseSubjectId, e);
            throw new UnauthorizedException(
                    "Failed to validate faculty assignment: " + e.getMessage());
        }
    }

    /**
     * Publish assignment created event to RabbitMQ
     */
    private void publishAssignmentCreatedEvent(Assignment assignment, Long facultyUserId) {
        try {
            // For now, we'll use faculty ID as name.
            // TODO: Call User Service to get faculty name if needed
            String facultyName = "Faculty-" + facultyUserId;

            AssignmentCreatedEvent event = new AssignmentCreatedEvent(
                    assignment.getAssignmentId(),
                    assignment.getBatchCourseSubjectId(),
                    assignment.getTitle(),
                    assignment.getDescription(),
                    assignment.getDueDate(),
                    facultyUserId,
                    facultyName);

            eventPublisher.publishAssignmentCreated(event);
            log.info("Published assignment created event for assignment: {}", assignment.getAssignmentId());
        } catch (Exception e) {
            log.error("Failed to publish assignment created event", e);
            // Don't throw - event publishing failure shouldn't break assignment creation
        }
    }

    /**
     * Check if assignment is overdue
     */
    public boolean isAssignmentOverdue(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assignment not found with ID: " + assignmentId));

        return LocalDateTime.now().isAfter(assignment.getDueDate());
    }
}
