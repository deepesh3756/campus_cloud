package com.campuscloud.assignment_service.client;

import com.campuscloud.assignment_service.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@FeignClient(
        name = "academic-service",
        configuration = com.campuscloud.assignment_service.config.FeignClientConfig.class
)
public interface AcademicServiceClient {

    @GetMapping("/api/academic/batch-course-subject/{bcsId}")
    ApiResponse<Map<String, Object>> getBatchCourseSubjectDetails(@PathVariable Long bcsId);

    @GetMapping("/api/academic/batch-course-subject/{bcsId}/students")
    ApiResponse<List<Long>> getEnrolledStudentIds(@PathVariable Long bcsId);

    @GetMapping("/api/academic/faculty/{facultyId}/subjects")
    ApiResponse<List<Map<String, Object>>> getFacultySubjects(@PathVariable Long facultyId);

    @GetMapping("/api/academic/validate-faculty-subject")
    ApiResponse<Boolean> validateFacultySubject(
            @RequestParam Long facultyId,
            @RequestParam Long batchCourseSubjectId
    );
}