package com.campuscloud.academicservice.controller;



import com.campuscloud.academicservice.dto.request.CreateCourseRequest;
import com.campuscloud.academicservice.dto.request.UpdateCourseRequest;
import com.campuscloud.academicservice.dto.response.ApiResponse;
import com.campuscloud.academicservice.dto.response.CourseDTO;
import com.campuscloud.academicservice.enums.CourseStatus;
import com.campuscloud.academicservice.service.CourseService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic/courses")
@Slf4j
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<CourseDTO>> createCourse(@Valid @RequestBody CreateCourseRequest request) {
        log.info("Create course request: {}", request.getCourseCode());
        CourseDTO course = courseService.createCourse(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Course created successfully", course));
    }
    
    @GetMapping("/{courseId}")
    public ResponseEntity<ApiResponse<CourseDTO>> getCourseById(@PathVariable Long courseId) {
        log.info("Get course request: {}", courseId);
        CourseDTO course = courseService.getCourseById(courseId);
        return ResponseEntity.ok(ApiResponse.success(course));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getAllCourses(
            @RequestParam(required = false) CourseStatus status) {
        log.info("Get all courses request with status: {}", status);
        List<CourseDTO> courses = courseService.getAllCourses(status);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }
    
    @PutMapping("/{courseId}")
    public ResponseEntity<ApiResponse<CourseDTO>> updateCourse(
            @PathVariable Long courseId,
            @Valid @RequestBody UpdateCourseRequest request) {
        log.info("Update course request: {}", courseId);
        CourseDTO course = courseService.updateCourse(courseId, request);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", course));
    }
    
    @DeleteMapping("/{courseId}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long courseId) {
        log.info("Delete course request: {}", courseId);
        courseService.deleteCourse(courseId);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully", null));
    }
}