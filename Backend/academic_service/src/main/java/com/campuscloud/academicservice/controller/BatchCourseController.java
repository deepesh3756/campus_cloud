package com.campuscloud.academicservice.controller;



import com.campuscloud.academicservice.dto.request.AddSubjectsToBatchCourseRequest;
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
    
    @PostMapping("/subjects")
    public ResponseEntity<ApiResponse<List<BatchCourseSubjectDTO>>> addSubjects(
            @Valid @RequestBody AddSubjectsToBatchCourseRequest request) {
        log.info("Add subjects to batch {} course {}", request.getBatchId(), request.getCourseId());
        List<BatchCourseSubjectDTO> subjects = batchCourseService.addSubjectsToBatchCourse(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Subjects added successfully", subjects));
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