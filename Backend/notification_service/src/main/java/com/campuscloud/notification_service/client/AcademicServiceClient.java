package com.campuscloud.notification_service.client;

import com.campuscloud.notification_service.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Feign Client to communicate with Academic Service
 */
@FeignClient(name = "academic-service")
public interface AcademicServiceClient {

    /**
     * Get list of student IDs enrolled in a batch-course-subject
     */
    @GetMapping("/api/academic/batch-course-subject/{bcsId}/students")
    ApiResponse<List<Long>> getEnrolledStudentIds(@PathVariable("bcsId") Long bcsId);
}
