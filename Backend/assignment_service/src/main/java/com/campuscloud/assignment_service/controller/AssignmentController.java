package com.campuscloud.assignment_service.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import com.campuscloud.assignment_service.dto.ApiResponse;
import com.campuscloud.assignment_service.dto.request.CreateAssignmentRequest;
import com.campuscloud.assignment_service.dto.request.EvaluateSubmissionRequest;
import com.campuscloud.assignment_service.dto.response.AnalyticsDTO;
import com.campuscloud.assignment_service.dto.response.AssignmentDTO;
import com.campuscloud.assignment_service.dto.response.StudentDashboardStatusSummaryDTO;
import com.campuscloud.assignment_service.dto.response.StudentSubjectAssignmentsDTO;
import com.campuscloud.assignment_service.dto.response.SubmissionDTO;
import com.campuscloud.assignment_service.dto.response.SubmissionWithStudentDTO;
import com.campuscloud.assignment_service.exception.UnauthorizedException;
import com.campuscloud.assignment_service.service.AnalyticsService;
import com.campuscloud.assignment_service.service.AssignmentService;
import com.campuscloud.assignment_service.service.SubmissionService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/assignments")
@Slf4j
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private Validator validator;

    private static final String HEADER_USER_ID = "X-User-Id";
    private static final String HEADER_USER_ID_ALT = "X-UserId";
    private static final String HEADER_USERNAME = "X-Username";
    private static final String HEADER_USERNAME_ALT = "X-User-Name";
    private static final String HEADER_ROLES = "X-Roles";
    private static final String HEADER_ROLE = "X-Role";

    // ==================== FACULTY ENDPOINTS ====================

    /**
     * 1. Create Assignment (Faculty only)
     * POST /api/assignments
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    @PreAuthorize("hasRole('FACULTY','ADMIN')")
    public ResponseEntity<ApiResponse<AssignmentDTO>> createAssignment(
            @RequestPart(value = "assignment", required = false) String assignmentJson,
            @RequestParam(value = "assignment", required = false) String assignmentParam,
            @RequestPart(value = "file", required = false) MultipartFile file,
            HttpServletRequest httpRequest
    ) {
        requireAnyRole(httpRequest, "FACULTY", "ADMIN");
        Long userId = requireUserId(httpRequest);
        boolean isAdmin = isAdmin(httpRequest);

        if ((assignmentJson == null || assignmentJson.trim().isEmpty())
                && (assignmentParam != null && !assignmentParam.trim().isEmpty())) {
            assignmentJson = assignmentParam;
        }

        if (assignmentJson == null || assignmentJson.trim().isEmpty()) {
            throw new IllegalArgumentException("Missing required part: assignment");
        }

        final CreateAssignmentRequest request;
        try {
            request = objectMapper.readValue(assignmentJson, CreateAssignmentRequest.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid assignment JSON");
        }

        var violations = validator.validate(request);
        if (!violations.isEmpty()) {
            String message = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));
            throw new IllegalArgumentException(message);
        }

        log.info("Creating assignment: {}", request.getTitle());
        AssignmentDTO assignment = assignmentService.createAssignment(request, file, userId, isAdmin);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Assignment created successfully", assignment));
    }

    /**
     * 1b. Update Assignment (Faculty only)
     * PUT /api/assignments/{assignmentId}
     */
    @PutMapping(value = "/{assignmentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AssignmentDTO>> updateAssignment(
            @PathVariable Long assignmentId,
            @RequestPart(value = "assignment", required = false) String assignmentJson,
            @RequestParam(value = "assignment", required = false) String assignmentParam,
            @RequestPart(value = "file", required = false) MultipartFile file,
            HttpServletRequest httpRequest
    ) {
        requireAnyRole(httpRequest, "FACULTY", "ADMIN");
        Long userId = requireUserId(httpRequest);
        boolean isAdmin = isAdmin(httpRequest);

        if ((assignmentJson == null || assignmentJson.trim().isEmpty())
                && (assignmentParam != null && !assignmentParam.trim().isEmpty())) {
            assignmentJson = assignmentParam;
        }

        if (assignmentJson == null || assignmentJson.trim().isEmpty()) {
            throw new IllegalArgumentException("Missing required part: assignment");
        }

        final CreateAssignmentRequest request;
        try {
            request = objectMapper.readValue(assignmentJson, CreateAssignmentRequest.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid assignment JSON");
        }

        var violations = validator.validate(request);
        if (!violations.isEmpty()) {
            String message = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));
            throw new IllegalArgumentException(message);
        }

        log.info("Updating assignment: {}", assignmentId);
        AssignmentDTO updated = assignmentService.updateAssignment(assignmentId, request, file, userId, isAdmin);

        return ResponseEntity.ok(ApiResponse.success("Assignment updated successfully", updated));
    }

    /**
     * 2. Get Assignments by Subject (Student & Faculty)
     * GET /api/assignments/subject/{batchCourseSubjectId}
     */
    @GetMapping("/subject/{batchCourseSubjectId}")
//    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY','ADMIN')")
    public ResponseEntity<ApiResponse<List<AssignmentDTO>>> getAssignmentsBySubject(
            @PathVariable Long batchCourseSubjectId,
            @RequestParam(required = false) String status,
            HttpServletRequest httpRequest
    ) {
        log.info("Fetching assignments for BCS: {}", batchCourseSubjectId);

        requireAnyRole(httpRequest, "STUDENT", "FACULTY", "ADMIN");
        
        List<AssignmentDTO> assignments = assignmentService
                .getAssignmentsBySubject(batchCourseSubjectId, status);
        
        return ResponseEntity.ok(ApiResponse.success(assignments));
    }

    /**
     * 3. Get Assignment Details (Student & Faculty)
     * GET /api/assignments/{assignmentId}
     */
    @GetMapping("/{assignmentId}")
//    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY','ADMIN')")
    public ResponseEntity<ApiResponse<AssignmentDTO>> getAssignmentById(
            @PathVariable Long assignmentId,
            HttpServletRequest httpRequest
    ) {
        log.info("Fetching assignment: {}", assignmentId);

        requireAnyRole(httpRequest, "STUDENT", "FACULTY", "ADMIN");
        
        AssignmentDTO assignment = assignmentService.getAssignmentById(assignmentId);
        
        return ResponseEntity.ok(ApiResponse.success(assignment));
    }

    @GetMapping("/{assignmentId}/preview")
    public ResponseEntity<byte[]> previewAssignmentFile(
            @PathVariable Long assignmentId,
            HttpServletRequest httpRequest
    ) {
        requireAnyRole(httpRequest, "STUDENT", "FACULTY", "ADMIN");

        AssignmentService.AssignmentFileContent content = assignmentService.getAssignmentFileContent(assignmentId);

        String mimeType = content.getMimeType();
        MediaType mediaType;
        try {
            mediaType = (mimeType != null && !mimeType.trim().isEmpty())
                    ? MediaType.parseMediaType(mimeType)
                    : MediaType.APPLICATION_OCTET_STREAM;
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDisposition(
                ContentDisposition.inline()
                        .filename(content.getFileName() != null ? content.getFileName() : "assignment")
                        .build()
        );

        return new ResponseEntity<>(content.getBytes(), headers, HttpStatus.OK);
    }

    /**
     * 4. Get All Submissions for Assignment (Faculty only)
     * GET /api/assignments/{assignmentId}/submissions
     */
    @GetMapping("/{assignmentId}/submissions")
//    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<List<SubmissionWithStudentDTO>>> getSubmissions(
            @PathVariable Long assignmentId,
            @RequestParam(required = false) String status,
            HttpServletRequest httpRequest
    ) {
        log.info("Fetching submissions for assignment: {}", assignmentId);

        requireAnyRole(httpRequest, "FACULTY", "ADMIN");
        
        List<SubmissionWithStudentDTO> submissions = submissionService
                .getSubmissionsForAssignment(assignmentId, status);
        
        return ResponseEntity.ok(ApiResponse.success(submissions));
    }

    /**
     * 5. Evaluate Submission (Faculty only)
     * POST /api/assignments/submissions/{submissionId}/evaluate
     */
    @PostMapping("/submissions/{submissionId}/evaluate")
//    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<SubmissionDTO>> evaluateSubmission(
            @PathVariable Long submissionId,
            @RequestBody @Valid EvaluateSubmissionRequest request,
            HttpServletRequest httpRequest
    ) {
        log.info("Evaluating submission: {}", submissionId);

        requireAnyRole(httpRequest, "FACULTY", "ADMIN");
        Long userId = requireUserId(httpRequest);
        boolean isAdmin = isAdmin(httpRequest);
        SubmissionDTO submission = submissionService
                .evaluateSubmission(submissionId, request, userId, isAdmin);
        
        return ResponseEntity.ok(ApiResponse.success("Submission evaluated successfully", submission));
    }

    /**
     * 6. Get Assignment Analytics (Faculty only)
     * GET /api/assignments/{assignmentId}/analytics
     */
    @GetMapping("/{assignmentId}/analytics")
//    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<AnalyticsDTO>> getAnalytics(
            @PathVariable Long assignmentId,
            HttpServletRequest httpRequest
    ) {
        log.info("Fetching analytics for assignment: {}", assignmentId);

        requireAnyRole(httpRequest, "FACULTY", "ADMIN");
        
        AnalyticsDTO analytics = analyticsService.getAssignmentAnalytics(assignmentId);
        
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    /**
     * 7. Get Faculty Statistics (Faculty only)
     * GET /api/assignments/faculty/statistics
     */
    @GetMapping("/faculty/statistics")
//    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<AnalyticsService.FacultyStatistics>> getFacultyStatistics(
            HttpServletRequest httpRequest
    ) {
        requireAnyRole(httpRequest, "FACULTY", "ADMIN");
        Long userId = requireUserId(httpRequest);
        boolean isAdmin = isAdmin(httpRequest);
        log.info("Fetching statistics for user: {}", userId);
        
        AnalyticsService.FacultyStatistics stats = analyticsService
                .getFacultyStatistics(userId, isAdmin);
        
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * 8. Update Assignment Status (Faculty only)
     * PATCH /api/assignments/{assignmentId}/status
     */
    @PatchMapping("/{assignmentId}/status")
//    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<AssignmentDTO>> updateAssignmentStatus(
            @PathVariable Long assignmentId,
            @RequestParam String status,
            HttpServletRequest httpRequest
    ) {
        log.info("Updating assignment {} status to: {}", assignmentId, status);

        requireAnyRole(httpRequest, "FACULTY", "ADMIN");
        Long userId = requireUserId(httpRequest);
        boolean isAdmin = isAdmin(httpRequest);
        AssignmentDTO assignment = assignmentService
                .updateAssignmentStatus(assignmentId, status, userId, isAdmin);
        
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", assignment));
    }

    /**
     * 9. Delete Assignment (Faculty only)
     * DELETE /api/assignments/{assignmentId}
     */
    @DeleteMapping("/{assignmentId}")
//    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(
            @PathVariable Long assignmentId,
            HttpServletRequest httpRequest
    ) {
        log.info("Deleting assignment: {}", assignmentId);

        requireAnyRole(httpRequest, "FACULTY", "ADMIN");
        Long userId = requireUserId(httpRequest);
        boolean isAdmin = isAdmin(httpRequest);
        assignmentService.deleteAssignment(assignmentId, userId, isAdmin);
        
        return ResponseEntity.ok(ApiResponse.success("Assignment deleted successfully", null));
    }

    // ==================== STUDENT ENDPOINTS ====================

    /**
     * 10. Submit Assignment (Student only)
     * POST /api/assignments/{assignmentId}/submit
     */
    @PostMapping(value = "/{assignmentId}/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<SubmissionDTO>> submitAssignment(
            @PathVariable Long assignmentId,
            @RequestPart("file") MultipartFile file,
            HttpServletRequest httpRequest
    ) {
        log.info("Student submitting assignment: {}", assignmentId);

        requireAnyRole(httpRequest, "STUDENT", "ADMIN");
        Long studentId = requireUserId(httpRequest);
        SubmissionDTO submission = submissionService.submitAssignment(assignmentId, file, studentId);
        
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Assignment submitted successfully", submission));
    }

    /**
     * 11. Get Student's Submission for Assignment (Student only)
     * GET /api/assignments/{assignmentId}/my-submission
     */
    @GetMapping("/{assignmentId}/my-submission")
//    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<SubmissionDTO>> getMySubmission(
            @PathVariable Long assignmentId,
            HttpServletRequest httpRequest
    ) {
        requireAnyRole(httpRequest, "STUDENT", "ADMIN");
        Long studentId = requireUserId(httpRequest);
        log.info("Fetching submission for assignment: {}, student: {}", assignmentId, studentId);
        
        SubmissionDTO submission = submissionService
                .getStudentSubmission(assignmentId, studentId);
        
        return ResponseEntity.ok(ApiResponse.success(submission));
    }

    /**
     * 12. Get Pending Assignments for Student (Student only)
     * GET /api/assignments/student/pending
     */
    @GetMapping("/student/pending")
//    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPendingAssignments(
            HttpServletRequest httpRequest
    ) {
        requireAnyRole(httpRequest, "STUDENT", "ADMIN");
        Long studentId = requireUserId(httpRequest);
        log.info("Fetching pending assignments for student: {}", studentId);
        
        List<Map<String, Object>> pending = submissionService
                .getPendingSubmissionsForStudent(studentId);
        
        return ResponseEntity.ok(ApiResponse.success(pending));
    }

    /**
     * 12b. Get Student Subjects with Assignment Keys + Submission Status (Student only)
     * GET /api/assignments/student
     */
    @GetMapping("/student")
    public ResponseEntity<ApiResponse<List<StudentSubjectAssignmentsDTO>>> getStudentSubjectAssignments(
            HttpServletRequest httpRequest
    ) {
        requireAnyRole(httpRequest, "STUDENT", "ADMIN");
        Long studentId = requireUserId(httpRequest);
        log.info("Fetching subject assignment matrix for student: {}", studentId);

        List<StudentSubjectAssignmentsDTO> data = submissionService.getStudentSubjectAssignments(studentId);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/student/status-summary")
    public ResponseEntity<ApiResponse<StudentDashboardStatusSummaryDTO>> getStudentStatusSummary(
            HttpServletRequest httpRequest
    ) {
        requireAnyRole(httpRequest, "STUDENT", "ADMIN");
        Long studentId = requireUserId(httpRequest);
        log.info("Fetching dashboard status summary for student: {}", studentId);

        StudentDashboardStatusSummaryDTO data = submissionService.getStudentDashboardStatusSummary(studentId);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /**
     * 13. Get All Submissions by Student (Student only)
     * GET /api/assignments/student/my-submissions
     */
    @GetMapping("/student/my-submissions")
//    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<SubmissionDTO>>> getMySubmissions(
            HttpServletRequest httpRequest
    ) {
        requireAnyRole(httpRequest, "STUDENT", "ADMIN");
        Long studentId = requireUserId(httpRequest);
        log.info("Fetching all submissions for student: {}", studentId);
        
        List<SubmissionDTO> submissions = submissionService
                .getSubmissionsByStudent(studentId);
        
        return ResponseEntity.ok(ApiResponse.success(submissions));
    }

    /**
     * 14. Delete Submission (Student only, before evaluation)
     * DELETE /api/assignments/submissions/{submissionId}
     */
    @DeleteMapping("/submissions/{submissionId}")
//    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Void>> deleteSubmission(
            @PathVariable Long submissionId,
            HttpServletRequest httpRequest
    ) {
        requireAnyRole(httpRequest, "STUDENT", "ADMIN");
        Long studentId = requireUserId(httpRequest);
        log.info("Student {} deleting submission: {}", studentId, submissionId);
        
        submissionService.deleteSubmission(submissionId, studentId);
        
        return ResponseEntity.ok(ApiResponse.success("Submission deleted successfully", null));
    }

    // ==================== COMMON ENDPOINTS ====================

    /**
     * 15. Download Submission File (Student for own, Faculty for all)
     * GET /api/assignments/submissions/{submissionId}/download
     */
    @GetMapping("/submissions/{submissionId}/download")
//    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY')")
    public ResponseEntity<ApiResponse<Map<String, String>>> downloadSubmission(
            @PathVariable Long submissionId,
            HttpServletRequest httpRequest
    ) {
        requireAnyRole(httpRequest, "STUDENT", "FACULTY", "ADMIN");
        Long userId = requireUserId(httpRequest);
        String role = requirePrimaryRole(httpRequest);
        log.info("User {} ({}) downloading submission: {}", userId, role, submissionId);
        
        String downloadUrl = submissionService
                .generateDownloadUrl(submissionId, userId, role);
        
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("downloadUrl", downloadUrl, "expiresIn", "3600")
        ));
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * 16. Get All Assignments (Admin only)
     * GET /api/assignments/admin/all
     */
    @GetMapping("/admin/all")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AssignmentDTO>>> getAllAssignments(HttpServletRequest httpRequest) {
        log.info("Admin fetching all assignments");
        requireRole(httpRequest, "ADMIN");
        List<AssignmentDTO> assignments = assignmentService.getAllAssignments();
        return ResponseEntity.ok(ApiResponse.success(assignments));
    }

    private boolean isAdmin(HttpServletRequest request) {
        List<String> roles = getRoles(request);
        return roles.stream().anyMatch(r -> "ADMIN".equalsIgnoreCase(r) || "ROLE_ADMIN".equalsIgnoreCase(r));
    }

    // ==================== UTILITY METHODS ====================

    private String getHeader(HttpServletRequest request, String... names) {
        for (String name : names) {
            String value = request.getHeader(name);
            if (value != null && !value.trim().isEmpty()) {
                return value.trim();
            }
        }
        return null;
    }

    private Long requireUserId(HttpServletRequest request) {
        String raw = getHeader(request, HEADER_USER_ID, HEADER_USER_ID_ALT);
        if (raw == null) {
            throw new UnauthorizedException("Missing user identity (X-User-Id)");
        }
        try {
            return Long.parseLong(raw);
        } catch (NumberFormatException ex) {
            throw new UnauthorizedException("Invalid user identity (X-User-Id)");
        }
    }

    private List<String> getRoles(HttpServletRequest request) {
        String raw = getHeader(request, HEADER_ROLES, HEADER_ROLE);
        if (raw == null) {
            return List.of();
        }
        return java.util.Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> s.toUpperCase())
                .collect(java.util.stream.Collectors.toList());
    }

    private String requirePrimaryRole(HttpServletRequest request) {
        List<String> roles = getRoles(request);
        if (roles.isEmpty()) {
            throw new UnauthorizedException("Missing user roles (X-Roles)");
        }
        String role = roles.get(0);
        if (role.startsWith("ROLE_")) {
            role = role.substring("ROLE_".length());
        }
        return role;
    }

    private void requireRole(HttpServletRequest request, String requiredRole) {
        List<String> roles = getRoles(request);
        String r = requiredRole.toUpperCase();
        boolean ok = roles.stream().anyMatch(role -> role.equals(r) || role.equals("ROLE_" + r));
        if (!ok) {
            String username = getHeader(request, HEADER_USERNAME, HEADER_USERNAME_ALT);
            throw new UnauthorizedException("Access denied" + (username != null ? (" for user: " + username) : ""));
        }
    }

    private void requireAnyRole(HttpServletRequest request, String... allowedRoles) {
        List<String> roles = getRoles(request);
        for (String allowedRole : allowedRoles) {
            String r = allowedRole.toUpperCase();
            boolean ok = roles.stream().anyMatch(role -> role.equals(r) || role.equals("ROLE_" + r));
            if (ok) return;
        }
        throw new UnauthorizedException("Access denied");
    }
}
