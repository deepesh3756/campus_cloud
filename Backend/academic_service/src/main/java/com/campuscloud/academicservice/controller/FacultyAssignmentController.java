package com.campuscloud.academicservice.controller;



import com.campuscloud.academicservice.dto.request.AssignFacultyRequest;
import com.campuscloud.academicservice.dto.response.ApiResponse;
import com.campuscloud.academicservice.dto.response.FacultyAssignmentDTO;
import com.campuscloud.academicservice.service.FacultyAssignmentService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic/faculty-assignments")
@Slf4j
public class FacultyAssignmentController {
    
    @Autowired
    private FacultyAssignmentService facultyAssignmentService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<FacultyAssignmentDTO>> assignFaculty(
            @Valid @RequestBody AssignFacultyRequest request) {
        log.info("Assign faculty request for user: {}", request.getUserId());
        FacultyAssignmentDTO assignment = facultyAssignmentService.assignFaculty(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Faculty assigned successfully", assignment));
    }
    
    @GetMapping("/faculty/{facultyUserId}")
    public ResponseEntity<ApiResponse<List<FacultyAssignmentDTO>>> getFacultyAssignments(
            @PathVariable Long facultyUserId) {
        log.info("Get assignments for faculty: {}", facultyUserId);
        List<FacultyAssignmentDTO> assignments = facultyAssignmentService.getFacultyAssignments(facultyUserId);
        return ResponseEntity.ok(ApiResponse.success(assignments));
    }
    
    @GetMapping("/subject/{batchCourseSubjectId}")
    public ResponseEntity<ApiResponse<List<FacultyAssignmentDTO>>> getFacultiesBySubject(
            @PathVariable Long batchCourseSubjectId) {
        log.info("Get faculties for subject: {}", batchCourseSubjectId);
        List<FacultyAssignmentDTO> faculties = facultyAssignmentService.getFacultiesBySubject(batchCourseSubjectId);
        return ResponseEntity.ok(ApiResponse.success(faculties));
    }

    @GetMapping("/batch-course/{batchCourseId}/faculty-ids")
    public ResponseEntity<ApiResponse<List<Long>>> getFacultyIdsByBatchCourse(
            @PathVariable Long batchCourseId) {
        log.info("Get faculty IDs for batch-course: {}", batchCourseId);
        return ResponseEntity.ok(ApiResponse.success(facultyAssignmentService.getFacultyUserIdsByBatchCourseId(batchCourseId)));
    }
}
