package com.campuscloud.academicservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campuscloud.academicservice.dto.request.EnrollStudentRequest;
import com.campuscloud.academicservice.dto.response.ApiResponse;
import com.campuscloud.academicservice.dto.response.EnrollmentDTO;
import com.campuscloud.academicservice.enums.StudentEnrollmentStatus;
import com.campuscloud.academicservice.service.EnrollmentService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/academic/enrollments")
@Slf4j
public class EnrollmentController {
@Autowired
private EnrollmentService enrollmentService;

@PostMapping
public ResponseEntity<ApiResponse<EnrollmentDTO>> enrollStudent(
        @Valid @RequestBody EnrollStudentRequest request) {
    log.info("Enroll student request for user: {}", request.getUserId());
    EnrollmentDTO enrollment = enrollmentService.enrollStudent(request);
    return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Student enrolled successfully", enrollment));
}

@GetMapping("/student/{userId}")
public ResponseEntity<ApiResponse<List<EnrollmentDTO>>> getStudentEnrollments(@PathVariable Long userId) {
    log.info("Get enrollments for student: {}", userId);
    List<EnrollmentDTO> enrollments = enrollmentService.getStudentEnrollments(userId);
    return ResponseEntity.ok(ApiResponse.success(enrollments));
}

@GetMapping("/batch-course/{batchCourseId}/students")
public ResponseEntity<ApiResponse<List<Long>>> getEnrolledStudentIds(@PathVariable Long batchCourseId) {
    log.info("Get enrolled student IDs for batch-course: {}", batchCourseId);
    List<Long> studentIds = enrollmentService.getEnrolledStudentIds(batchCourseId);
    return ResponseEntity.ok(ApiResponse.success(studentIds));
}

@PatchMapping("/{enrollmentId}/status")
public ResponseEntity<ApiResponse<EnrollmentDTO>> updateEnrollmentStatus(
        @PathVariable Long enrollmentId,
        @RequestBody StudentEnrollmentStatus status) {
    log.info("Update enrollment status: {}", enrollmentId);
    EnrollmentDTO enrollment = enrollmentService.updateEnrollmentStatus(enrollmentId, status);
    return ResponseEntity.ok(ApiResponse.success("Enrollment status updated", enrollment));
}
}
