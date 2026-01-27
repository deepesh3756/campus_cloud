package com.campuscloud.academicservice.service;



import com.campuscloud.academicservice.dto.request.AssignFacultyRequest;
import com.campuscloud.academicservice.dto.response.FacultyAssignmentDTO;
import com.campuscloud.academicservice.entity.BatchCourseSubject;
import com.campuscloud.academicservice.entity.FacultyAssignment;
import com.campuscloud.academicservice.exception.DuplicateResourceException;
import com.campuscloud.academicservice.exception.ResourceNotFoundException;
import com.campuscloud.academicservice.repository.BatchCourseSubjectRepository;
import com.campuscloud.academicservice.repository.FacultyAssignmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class FacultyAssignmentService {
    
    @Autowired
    private FacultyAssignmentRepository facultyAssignmentRepository;
    
    @Autowired
    private BatchCourseSubjectRepository batchCourseSubjectRepository;
    
    @Transactional
    public FacultyAssignmentDTO assignFaculty(AssignFacultyRequest request) {
        log.info("Assigning faculty {} to subject {}", request.getUserId(), request.getSubjectId());
        
        // Find batch-course-subject
        List<BatchCourseSubject> bcsList = batchCourseSubjectRepository
                .findSubjectsByBatchAndCourse(request.getBatchId(), request.getCourseId());
        
        BatchCourseSubject bcs = bcsList.stream()
                .filter(b -> b.getSubject().getSubjectId().equals(request.getSubjectId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Subject not found in the specified batch-course combination"
                ));
        
        // Check if already assigned
        if (facultyAssignmentRepository.existsByUserIdAndBatchCourseSubject_BatchCourseSubjectId(
                request.getUserId(), bcs.getBatchCourseSubjectId())) {
            throw new DuplicateResourceException(
                "Faculty already assigned to this subject"
            );
        }
        
        // Create assignment
        FacultyAssignment assignment = FacultyAssignment.builder()
                .userId(request.getUserId())
                .batchCourseSubject(bcs)
                .build();
        
        FacultyAssignment saved = facultyAssignmentRepository.save(assignment);
        log.info("Faculty assigned successfully: {}", saved.getAssignmentId());
        
        return FacultyAssignmentDTO.fromEntity(saved);
    }
    
    public List<FacultyAssignmentDTO> getFacultyAssignments(Long facultyUserId) {
        List<FacultyAssignment> assignments = facultyAssignmentRepository
                .findActiveFacultyAssignments(facultyUserId);
        
        return assignments.stream()
                .map(FacultyAssignmentDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<FacultyAssignmentDTO> getFacultiesBySubject(Long batchCourseSubjectId) {
        List<FacultyAssignment> assignments = facultyAssignmentRepository
                .findByBatchCourseSubject_BatchCourseSubjectId(batchCourseSubjectId);
        
        return assignments.stream()
                .map(FacultyAssignmentDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
