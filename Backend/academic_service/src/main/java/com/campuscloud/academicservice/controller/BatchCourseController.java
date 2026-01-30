package com.campuscloud.academicservice.controller;

import com.campuscloud.academicservice.dto.request.AddSubjectsToBatchCourseRequest;
import com.campuscloud.academicservice.dto.request.CreateBatchCourseRequest;
import com.campuscloud.academicservice.dto.response.ApiResponse;
import com.campuscloud.academicservice.dto.response.BatchCourseDTO;
import com.campuscloud.academicservice.dto.response.BatchCourseSubjectDTO;
import com.campuscloud.academicservice.service.BatchCourseService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic/batch-courses")
@Slf4j
public class BatchCourseController {

    @Autowired
    private BatchCourseService batchCourseService;

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<ApiResponse<List<BatchCourseDTO>>> getCoursesByBatch(@PathVariable Long batchId) {
        log.info("Get courses for batch: {}", batchId);
        List<BatchCourseDTO> courses = batchCourseService.getCoursesByBatch(batchId);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BatchCourseDTO>> createBatchCourse(
            @Valid @RequestBody CreateBatchCourseRequest request) {
        log.info("Create batch-course request for batch {} and course {}", request.getBatchId(), request.getCourseId());
        BatchCourseDTO created = batchCourseService.createBatchCourse(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Batch-course created successfully", created));
    }

    @GetMapping("/{batchCourseId}")
    public ResponseEntity<ApiResponse<BatchCourseDTO>> getBatchCourseById(@PathVariable Long batchCourseId) {
        log.info("Get batch-course by id: {}", batchCourseId);
        BatchCourseDTO course = batchCourseService.getBatchCourseById(batchCourseId);
        return ResponseEntity.ok(ApiResponse.success(course));
    }

    @DeleteMapping("/{batchCourseId}")
    public ResponseEntity<ApiResponse<Void>> deleteBatchCourse(@PathVariable Long batchCourseId) {
        log.info("Delete batch-course by id: {}", batchCourseId);
        batchCourseService.deleteBatchCourse(batchCourseId);
        return ResponseEntity.ok(ApiResponse.success("Batch-course deleted successfully", null));
    }

    @PostMapping("/subjects")
    public ResponseEntity<ApiResponse<List<BatchCourseSubjectDTO>>> addSubjects(
            @Valid @RequestBody AddSubjectsToBatchCourseRequest request) {
        log.info("Add subjects to batch {} course {}", request.getBatchId(), request.getCourseId());
        List<BatchCourseSubjectDTO> subjects = batchCourseService.addSubjectsToBatchCourse(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Subjects added successfully", subjects));
    }

    @GetMapping("/{batchCourseId}/subjects")
    public ResponseEntity<ApiResponse<List<BatchCourseSubjectDTO>>> getSubjectsByBatchCourseId(
            @PathVariable Long batchCourseId) {
        log.info("Get subjects for batch-course: {}", batchCourseId);
        List<BatchCourseSubjectDTO> subjects = batchCourseService.getSubjectsByBatchCourseId(batchCourseId);
        return ResponseEntity.ok(ApiResponse.success(subjects));
    }

    @GetMapping("/subjects/{batchCourseSubjectId}")
    public ResponseEntity<ApiResponse<BatchCourseSubjectDTO>> getBatchCourseSubjectById(
            @PathVariable Long batchCourseSubjectId) {
        log.info("Get batch-course-subject by id: {}", batchCourseSubjectId);
        BatchCourseSubjectDTO subject = batchCourseService.getBatchCourseSubjectById(batchCourseSubjectId);
        return ResponseEntity.ok(ApiResponse.success(subject));
    }

    @DeleteMapping("/subjects/{batchCourseSubjectId}")
    public ResponseEntity<ApiResponse<Void>> deleteBatchCourseSubject(@PathVariable Long batchCourseSubjectId) {
        log.info("Delete batch-course-subject by id: {}", batchCourseSubjectId);
        batchCourseService.deleteBatchCourseSubject(batchCourseSubjectId);
        return ResponseEntity.ok(ApiResponse.success("Batch-course-subject deleted successfully", null));
    }

    @GetMapping("/batch/{batchId}/course/{courseId}/subjects")
    public ResponseEntity<ApiResponse<List<BatchCourseSubjectDTO>>> getSubjectsByBatchAndCourse(
            @PathVariable Long batchId,
            @PathVariable Long courseId) {
        log.info("Get subjects for batch {} and course {}", batchId, courseId);
        List<BatchCourseSubjectDTO> subjects = batchCourseService.getSubjectsByBatchAndCourse(batchId, courseId);
        return ResponseEntity.ok(ApiResponse.success(subjects));
    }
}