package com.campuscloud.academicservice.controller;



import com.campuscloud.academicservice.dto.request.CreateSubjectRequest;
import com.campuscloud.academicservice.dto.request.UpdateSubjectRequest;
import com.campuscloud.academicservice.dto.response.ApiResponse;
import com.campuscloud.academicservice.dto.response.SubjectDTO;
import com.campuscloud.academicservice.service.SubjectService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic/subjects")
@Slf4j
public class SubjectController {
    
    @Autowired
    private SubjectService subjectService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<SubjectDTO>> createSubject(@Valid @RequestBody CreateSubjectRequest request) {
        log.info("Create subject request: {}", request.getSubjectCode());
        SubjectDTO subject = subjectService.createSubject(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Subject created successfully", subject));
    }
    
    @GetMapping("/{subjectId}")
    public ResponseEntity<ApiResponse<SubjectDTO>> getSubjectById(@PathVariable Long subjectId) {
        log.info("Get subject request: {}", subjectId);
        SubjectDTO subject = subjectService.getSubjectById(subjectId);
        return ResponseEntity.ok(ApiResponse.success(subject));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectDTO>>> getAllSubjects() {
        log.info("Get all subjects request");
        List<SubjectDTO> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(ApiResponse.success(subjects));
    }

    @PutMapping("/{subjectId}")
    public ResponseEntity<ApiResponse<SubjectDTO>> updateSubject(
            @PathVariable Long subjectId,
            @Valid @RequestBody UpdateSubjectRequest request
    ) {
        log.info("Update subject request: {}", subjectId);
        SubjectDTO subject = subjectService.updateSubject(subjectId, request);
        return ResponseEntity.ok(ApiResponse.success("Subject updated successfully", subject));
    }
    
    @DeleteMapping("/{subjectId}")
    public ResponseEntity<ApiResponse<Void>> deleteSubject(@PathVariable Long subjectId) {
        log.info("Delete subject request: {}", subjectId);
        subjectService.deleteSubject(subjectId);
        return ResponseEntity.ok(ApiResponse.success("Subject deleted successfully", null));
    }
}
