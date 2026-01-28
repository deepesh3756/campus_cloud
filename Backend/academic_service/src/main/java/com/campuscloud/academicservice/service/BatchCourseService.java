package com.campuscloud.academicservice.service;



import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campuscloud.academicservice.dto.request.AddSubjectsToBatchCourseRequest;
import com.campuscloud.academicservice.dto.response.BatchCourseDTO;
import com.campuscloud.academicservice.dto.response.BatchCourseSubjectDTO;
import com.campuscloud.academicservice.entity.Batch;
import com.campuscloud.academicservice.entity.BatchCourse;
import com.campuscloud.academicservice.entity.BatchCourseSubject;
import com.campuscloud.academicservice.entity.Course;
import com.campuscloud.academicservice.entity.Subject;
import com.campuscloud.academicservice.exception.ResourceNotFoundException;
import com.campuscloud.academicservice.repository.BatchCourseRepository;
import com.campuscloud.academicservice.repository.BatchCourseSubjectRepository;
import com.campuscloud.academicservice.repository.BatchRepository;
import com.campuscloud.academicservice.repository.CourseRepository;
import com.campuscloud.academicservice.repository.SubjectRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BatchCourseService {
    
    @Autowired
    private BatchCourseRepository batchCourseRepository;
    
    @Autowired
    private BatchRepository batchRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private BatchCourseSubjectRepository batchCourseSubjectRepository;
    
    public List<BatchCourseDTO> getCoursesByBatch(Long batchId) {
        List<BatchCourse> batchCourses = batchCourseRepository.findByBatch_BatchId(batchId);
        
        return batchCourses.stream()
                .map(bc -> BatchCourseDTO.fromEntity(bc, true))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public List<BatchCourseSubjectDTO> addSubjectsToBatchCourse(AddSubjectsToBatchCourseRequest request) {
        log.info("Adding subjects to batch {} and course {}", request.getBatchId(), request.getCourseId());
        
        // Validate batch and course
        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found: " + request.getBatchId()));
        
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + request.getCourseId()));
        
        // Find or create batch-course mapping
        BatchCourse batchCourse = batchCourseRepository
                .findByBatch_BatchIdAndCourse_CourseId(request.getBatchId(), request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Batch-Course mapping not found. Please add the course to the batch first."
                ));
        
        List<BatchCourseSubject> createdBCS = new ArrayList<>();
        
        // Add each subject
        for (Long subjectId : request.getSubjectIds()) {
            Subject subject = subjectRepository.findById(subjectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + subjectId));
            
            // Check if already exists
            if (batchCourseSubjectRepository.existsByBatchCourse_BatchCourseIdAndSubject_SubjectId(
                    batchCourse.getBatchCourseId(), subjectId)) {
                log.warn("Subject {} already assigned to batch-course {}", subjectId, batchCourse.getBatchCourseId());
                continue;
            }
            
            BatchCourseSubject bcs = BatchCourseSubject.builder()
                    .batchCourse(batchCourse)
                    .subject(subject)
                    .facultyAssignments(new ArrayList<>())
                    .build();
            
            createdBCS.add(batchCourseSubjectRepository.save(bcs));
        }
        
        log.info("Added {} subjects to batch-course", createdBCS.size());
        
        return createdBCS.stream()
                .map(BatchCourseSubjectDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<BatchCourseSubjectDTO> getSubjectsByBatchAndCourse(Long batchId, Long courseId) {
        List<BatchCourseSubject> subjects = batchCourseSubjectRepository
                .findSubjectsByBatchAndCourse(batchId, courseId);
        
        return subjects.stream()
                .map(BatchCourseSubjectDTO::fromEntity)
                .collect(Collectors.toList());
    }
}