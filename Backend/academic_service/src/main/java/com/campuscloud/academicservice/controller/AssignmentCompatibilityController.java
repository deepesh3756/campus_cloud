package com.campuscloud.academicservice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campuscloud.academicservice.dto.response.ApiResponse;
import com.campuscloud.academicservice.dto.response.BatchCourseSubjectDTO;
import com.campuscloud.academicservice.entity.BatchCourseSubject;
import com.campuscloud.academicservice.exception.ResourceNotFoundException;
import com.campuscloud.academicservice.repository.BatchCourseSubjectRepository;
import com.campuscloud.academicservice.repository.FacultyAssignmentRepository;
import com.campuscloud.academicservice.service.BatchCourseService;
import com.campuscloud.academicservice.service.EnrollmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/academic")
@RequiredArgsConstructor
public class AssignmentCompatibilityController {

    private final BatchCourseService batchCourseService;
    private final EnrollmentService enrollmentService;
    private final BatchCourseSubjectRepository batchCourseSubjectRepository;
    private final FacultyAssignmentRepository facultyAssignmentRepository;

    @GetMapping("/batch-course-subject/{bcsId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBatchCourseSubjectDetails(
            @PathVariable Long bcsId
    ) {
        BatchCourseSubjectDTO dto = batchCourseService.getBatchCourseSubjectById(bcsId);

        Map<String, Object> data = new HashMap<>();
        data.put("batchCourseSubjectId", dto.getBatchCourseSubjectId());
        data.put("batchId", dto.getBatchId());
        data.put("batchName", dto.getBatchName());
        data.put("courseId", dto.getCourseId());
        data.put("courseCode", dto.getCourseCode());
        data.put("courseName", dto.getCourseName());
        data.put("subjectId", dto.getSubjectId());
        data.put("subjectCode", dto.getSubjectCode());
        data.put("subjectName", dto.getSubjectName());

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/batch-course-subject/{bcsId}/students")
    public ResponseEntity<ApiResponse<List<Long>>> getEnrolledStudentIds(
            @PathVariable Long bcsId
    ) {
        BatchCourseSubject bcs = batchCourseSubjectRepository.findById(bcsId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Batch-Course-Subject mapping not found: " + bcsId
                ));

        Long batchCourseId = bcs.getBatchCourse() != null ? bcs.getBatchCourse().getBatchCourseId() : null;
        if (batchCourseId == null) {
            throw new ResourceNotFoundException("Batch-Course mapping not found for batch-course-subject: " + bcsId);
        }

        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getEnrolledStudentIds(batchCourseId)));
    }

    @GetMapping("/faculty/{facultyId}/subjects")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFacultySubjects(
            @PathVariable Long facultyId
    ) {
        List<Map<String, Object>> data = facultyAssignmentRepository.findActiveFacultyAssignments(facultyId)
                .stream()
                .map(fa -> {
                    Map<String, Object> row = new HashMap<>();
                    if (fa.getBatchCourseSubject() != null) {
                        row.put("batchCourseSubjectId", fa.getBatchCourseSubject().getBatchCourseSubjectId());
                    }
                    return row;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/validate-faculty-subject")
    public ResponseEntity<ApiResponse<Boolean>> validateFacultySubject(
            @RequestParam Long facultyId,
            @RequestParam Long batchCourseSubjectId
    ) {
        boolean assigned = facultyAssignmentRepository
                .existsByUserIdAndBatchCourseSubject_BatchCourseSubjectId(facultyId, batchCourseSubjectId);

        return ResponseEntity.ok(ApiResponse.success(assigned));
    }
}
