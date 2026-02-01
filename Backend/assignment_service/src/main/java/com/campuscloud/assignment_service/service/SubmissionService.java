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

import com.campuscloud.assignment_service.dto.response.StudentSubjectAssignmentsDTO;
import com.campuscloud.assignment_service.dto.response.StudentDashboardStatusSummaryDTO;
import com.campuscloud.assignment_service.dto.response.StudentStatusBlockDTO;
import com.campuscloud.assignment_service.dto.response.SubjectCountDTO;

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

    public List<StudentSubjectAssignmentsDTO> getStudentSubjectAssignments(Long studentUserId) {
        log.info("Building subject-assignment matrix for student: {}", studentUserId);

        ApiResponse<List<Map<String, Object>>> enrollmentResp = academicServiceClient.getStudentEnrollments(studentUserId);
        List<Map<String, Object>> enrollments = enrollmentResp != null && enrollmentResp.isSuccess() && enrollmentResp.getData() != null
                ? enrollmentResp.getData()
                : List.of();

        List<Long> batchCourseIds = enrollments.stream()
                .map(e -> e.get("batchCourseId"))
                .filter(v -> v instanceof Number)
                .map(v -> ((Number) v).longValue())
                .distinct()
                .collect(Collectors.toList());

        if (batchCourseIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<Map<String, Object>> bcsRows = new ArrayList<>();
        for (Long batchCourseId : batchCourseIds) {
            try {
                ApiResponse<List<Map<String, Object>>> resp = academicServiceClient.getBatchCourseSubjects(batchCourseId);
                if (resp != null && resp.isSuccess() && resp.getData() != null) {
                    bcsRows.addAll(resp.getData());
                }
            } catch (Exception ex) {
                log.warn("Failed to fetch batch-course subjects for batchCourseId={}", batchCourseId, ex);
            }
        }

        if (bcsRows.isEmpty()) {
            return new ArrayList<>();
        }

        List<Long> bcsIds = bcsRows.stream()
                .map(r -> r.get("batchCourseSubjectId"))
                .filter(v -> v instanceof Number)
                .map(v -> ((Number) v).longValue())
                .distinct()
                .collect(Collectors.toList());

        if (bcsIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<Assignment> assignments = assignmentRepository.findByBatchCourseSubjectIdIn(bcsIds);
        Map<Long, List<Assignment>> assignmentsByBcs = (assignments == null ? List.<Assignment>of() : assignments)
                .stream()
                .collect(Collectors.groupingBy(Assignment::getBatchCourseSubjectId));

        List<Long> assignmentIds = (assignments == null ? List.<Assignment>of() : assignments)
                .stream()
                .map(Assignment::getAssignmentId)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, Submission> submissionByAssignmentId = new HashMap<>();
        if (!assignmentIds.isEmpty()) {
            List<Submission> submissions = submissionRepository.findByStudentUserIdAndAssignmentIdIn(studentUserId, assignmentIds);
            for (Submission s : (submissions == null ? List.<Submission>of() : submissions)) {
                if (s != null && s.getAssignmentId() != null) {
                    submissionByAssignmentId.put(s.getAssignmentId(), s);
                }
            }
        }

        List<StudentSubjectAssignmentsDTO> result = new ArrayList<>();
        for (Map<String, Object> row : bcsRows) {
            Object bcsIdRaw = row.get("batchCourseSubjectId");
            if (!(bcsIdRaw instanceof Number)) continue;
            Long bcsId = ((Number) bcsIdRaw).longValue();

            String subjectCode = row.get("subjectCode") != null ? String.valueOf(row.get("subjectCode")) : null;
            String subjectName = row.get("subjectName") != null ? String.valueOf(row.get("subjectName")) : null;

            List<Assignment> subjectAssignments = assignmentsByBcs.getOrDefault(bcsId, List.of());

            List<Assignment> ordered = subjectAssignments.stream()
                    .sorted((a, b) -> {
                        if (a.getCreatedAt() != null && b.getCreatedAt() != null) {
                            return a.getCreatedAt().compareTo(b.getCreatedAt());
                        }
                        return a.getAssignmentId().compareTo(b.getAssignmentId());
                    })
                    .collect(Collectors.toList());

            int latestKey = ordered.size();
            List<Integer> submittedKeys = new ArrayList<>();
            for (int i = 0; i < ordered.size(); i++) {
                Assignment a = ordered.get(i);
                Submission s = submissionByAssignmentId.get(a.getAssignmentId());
                if (s != null && (s.getStatus() == Submission.SubmissionStatus.SUBMITTED || s.getStatus() == Submission.SubmissionStatus.EVALUATED)) {
                    submittedKeys.add(i + 1);
                }
            }

            result.add(StudentSubjectAssignmentsDTO.builder()
                    .batchCourseSubjectId(bcsId)
                    .subjectCode(subjectCode)
                    .subjectName(subjectName)
                    .latestKey(latestKey)
                    .submittedKeys(submittedKeys)
                    .build());
        }

        return result;
    }

    public StudentDashboardStatusSummaryDTO getStudentDashboardStatusSummary(Long studentUserId) {
        log.info("Building dashboard status summary for student: {}", studentUserId);

        ApiResponse<List<Map<String, Object>>> enrollmentResp = academicServiceClient.getStudentEnrollments(studentUserId);
        List<Map<String, Object>> enrollments = enrollmentResp != null && enrollmentResp.isSuccess() && enrollmentResp.getData() != null
                ? enrollmentResp.getData()
                : List.of();

        List<Long> batchCourseIds = enrollments.stream()
                .map(e -> e.get("batchCourseId"))
                .filter(v -> v instanceof Number)
                .map(v -> ((Number) v).longValue())
                .distinct()
                .collect(Collectors.toList());

        if (batchCourseIds.isEmpty()) {
            return StudentDashboardStatusSummaryDTO.builder()
                    .pending(StudentStatusBlockDTO.builder().total(0L).subjects(List.of()).build())
                    .submitted(StudentStatusBlockDTO.builder().total(0L).subjects(List.of()).build())
                    .evaluated(StudentStatusBlockDTO.builder().total(0L).subjects(List.of()).build())
                    .build();
        }

        List<Map<String, Object>> bcsRows = new ArrayList<>();
        for (Long batchCourseId : batchCourseIds) {
            try {
                ApiResponse<List<Map<String, Object>>> resp = academicServiceClient.getBatchCourseSubjects(batchCourseId);
                if (resp != null && resp.isSuccess() && resp.getData() != null) {
                    bcsRows.addAll(resp.getData());
                }
            } catch (Exception ex) {
                log.warn("Failed to fetch batch-course subjects for batchCourseId={}", batchCourseId, ex);
            }
        }

        Map<Long, SubjectCountDTO> subjectMetaByBcsId = new HashMap<>();
        for (Map<String, Object> row : bcsRows) {
            Object bcsIdRaw = row.get("batchCourseSubjectId");
            if (!(bcsIdRaw instanceof Number)) {
                continue;
            }
            Long bcsId = ((Number) bcsIdRaw).longValue();
            String subjectCode = row.get("subjectCode") != null ? String.valueOf(row.get("subjectCode")) : null;
            String subjectName = row.get("subjectName") != null ? String.valueOf(row.get("subjectName")) : null;

            subjectMetaByBcsId.putIfAbsent(
                    bcsId,
                    SubjectCountDTO.builder()
                            .batchCourseSubjectId(bcsId)
                            .subjectCode(subjectCode)
                            .subjectName(subjectName)
                            .count(0L)
                            .build()
            );
        }

        List<Long> bcsIds = subjectMetaByBcsId.keySet().stream().collect(Collectors.toList());
        if (bcsIds.isEmpty()) {
            return StudentDashboardStatusSummaryDTO.builder()
                    .pending(StudentStatusBlockDTO.builder().total(0L).subjects(List.of()).build())
                    .submitted(StudentStatusBlockDTO.builder().total(0L).subjects(List.of()).build())
                    .evaluated(StudentStatusBlockDTO.builder().total(0L).subjects(List.of()).build())
                    .build();
        }

        List<Assignment> assignments = assignmentRepository.findByBatchCourseSubjectIdIn(bcsIds);
        List<Long> assignmentIds = (assignments == null ? List.<Assignment>of() : assignments)
                .stream()
                .map(Assignment::getAssignmentId)
                .distinct()
                .collect(Collectors.toList());

        if (assignmentIds.isEmpty()) {
            return StudentDashboardStatusSummaryDTO.builder()
                    .pending(StudentStatusBlockDTO.builder().total(0L).subjects(List.of()).build())
                    .submitted(StudentStatusBlockDTO.builder().total(0L).subjects(List.of()).build())
                    .evaluated(StudentStatusBlockDTO.builder().total(0L).subjects(List.of()).build())
                    .build();
        }

        Map<Long, Long> assignmentIdToBcsId = (assignments == null ? List.<Assignment>of() : assignments)
                .stream()
                .filter(a -> a.getAssignmentId() != null && a.getBatchCourseSubjectId() != null)
                .collect(Collectors.toMap(
                        Assignment::getAssignmentId,
                        Assignment::getBatchCourseSubjectId,
                        (a, b) -> a
                ));

        List<Submission> submissions = submissionRepository.findByStudentUserIdAndAssignmentIdIn(studentUserId, assignmentIds);
        List<Submission> safeSubmissions = submissions == null ? List.of() : submissions;

        Map<Long, Long> pendingCounts = new HashMap<>();
        Map<Long, Long> submittedCounts = new HashMap<>();
        Map<Long, Long> evaluatedCounts = new HashMap<>();

        for (Submission s : safeSubmissions) {
            if (s == null || s.getAssignmentId() == null || s.getStatus() == null) {
                continue;
            }
            Long bcsId = assignmentIdToBcsId.get(s.getAssignmentId());
            if (bcsId == null) {
                continue;
            }

            switch (s.getStatus()) {
                case NOT_SUBMITTED -> pendingCounts.merge(bcsId, 1L, Long::sum);
                case SUBMITTED -> submittedCounts.merge(bcsId, 1L, Long::sum);
                case EVALUATED -> evaluatedCounts.merge(bcsId, 1L, Long::sum);
            }
        }

        java.util.Comparator<SubjectCountDTO> subjectSort = (a, b) -> {
            String an = a != null && a.getSubjectName() != null ? a.getSubjectName() : "";
            String bn = b != null && b.getSubjectName() != null ? b.getSubjectName() : "";
            int c = an.compareToIgnoreCase(bn);
            if (c != 0) return c;
            String ac = a != null && a.getSubjectCode() != null ? a.getSubjectCode() : "";
            String bc = b != null && b.getSubjectCode() != null ? b.getSubjectCode() : "";
            return ac.compareToIgnoreCase(bc);
        };

        List<SubjectCountDTO> pendingSubjects = pendingCounts.entrySet().stream()
                .map(e -> {
                    SubjectCountDTO meta = subjectMetaByBcsId.get(e.getKey());
                    if (meta == null) return null;
                    return SubjectCountDTO.builder()
                            .batchCourseSubjectId(meta.getBatchCourseSubjectId())
                            .subjectCode(meta.getSubjectCode())
                            .subjectName(meta.getSubjectName())
                            .count(e.getValue())
                            .build();
                })
                .filter(v -> v != null)
                .sorted(subjectSort)
                .collect(Collectors.toList());

        List<SubjectCountDTO> submittedSubjects = submittedCounts.entrySet().stream()
                .map(e -> {
                    SubjectCountDTO meta = subjectMetaByBcsId.get(e.getKey());
                    if (meta == null) return null;
                    return SubjectCountDTO.builder()
                            .batchCourseSubjectId(meta.getBatchCourseSubjectId())
                            .subjectCode(meta.getSubjectCode())
                            .subjectName(meta.getSubjectName())
                            .count(e.getValue())
                            .build();
                })
                .filter(v -> v != null)
                .sorted(subjectSort)
                .collect(Collectors.toList());

        List<SubjectCountDTO> evaluatedSubjects = evaluatedCounts.entrySet().stream()
                .map(e -> {
                    SubjectCountDTO meta = subjectMetaByBcsId.get(e.getKey());
                    if (meta == null) return null;
                    return SubjectCountDTO.builder()
                            .batchCourseSubjectId(meta.getBatchCourseSubjectId())
                            .subjectCode(meta.getSubjectCode())
                            .subjectName(meta.getSubjectName())
                            .count(e.getValue())
                            .build();
                })
                .filter(v -> v != null)
                .sorted(subjectSort)
                .collect(Collectors.toList());

        long pendingTotal = pendingSubjects.stream().mapToLong(SubjectCountDTO::getCount).sum();
        long submittedTotal = submittedSubjects.stream().mapToLong(SubjectCountDTO::getCount).sum();
        long evaluatedTotal = evaluatedSubjects.stream().mapToLong(SubjectCountDTO::getCount).sum();

        return StudentDashboardStatusSummaryDTO.builder()
                .pending(StudentStatusBlockDTO.builder().total(pendingTotal).subjects(pendingSubjects).build())
                .submitted(StudentStatusBlockDTO.builder().total(submittedTotal).subjects(submittedSubjects).build())
                .evaluated(StudentStatusBlockDTO.builder().total(evaluatedTotal).subjects(evaluatedSubjects).build())
                .build();
    }

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
                if (!response.getData().isEmpty()) {
                    Map<String, Object> first = response.getData().get(0);
                    log.info("users-service bulk user details keys sample: {}", first == null ? null : first.keySet());
                }
                response.getData().forEach(user -> {
                    if (user == null) {
                        return;
                    }

                    Object rawUserId = firstNonNull(user.get("userId"), user.get("id"), user.get("user_id"));
                    Long userId = asLong(rawUserId);
                    if (userId == null) {
                        return;
                    }

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

                    String firstName = null;
                    String lastName = null;
                    String prn = null;
                    String email = null;
                    if (studentDetails != null) {
                        firstName = asString(firstNonNull(
                                studentDetails.get("firstName"),
                                studentDetails.get("first_name"),
                                studentDetails.get("firstname")
                        ));
                        lastName = asString(firstNonNull(
                                studentDetails.get("lastName"),
                                studentDetails.get("last_name"),
                                studentDetails.get("lastname")
                        ));
                        prn = asString(firstNonNull(
                                studentDetails.get("prn"),
                                studentDetails.get("PRN"),
                                studentDetails.get("studentPrn"),
                                studentDetails.get("student_prn")
                        ));
                        email = asString(firstNonNull(studentDetails.get("email"), studentDetails.get("mail")));
                    }

                    String fullName = null;
                    if ((firstName != null && !firstName.isBlank()) || (lastName != null && !lastName.isBlank())) {
                        fullName = String.format("%s %s", firstName == null ? "" : firstName, lastName == null ? "" : lastName)
                                .trim();
                    }

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
                            .studentName(fullName != null && !fullName.isBlank() ? fullName : "Unknown")
                            .studentEmail(email)
                            .studentPrn(prn)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private static Object firstNonNull(Object... values) {
        if (values == null) {
            return null;
        }
        for (Object v : values) {
            if (v != null) {
                return v;
            }
        }
        return null;
    }

    private static Long asLong(Object v) {
        if (v == null) {
            return null;
        }
        if (v instanceof Number n) {
            return n.longValue();
        }
        try {
            String s = v.toString().trim();
            if (s.isEmpty()) {
                return null;
            }
            return Long.parseLong(s);
        } catch (Exception ignored) {
            return null;
        }
    }

    private static String asString(Object v) {
        if (v == null) {
            return null;
        }
        String s = v.toString();
        return s == null ? null : s.trim();
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
