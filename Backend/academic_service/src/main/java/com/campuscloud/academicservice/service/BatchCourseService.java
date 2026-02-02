package com.campuscloud.academicservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campuscloud.academicservice.dto.request.AddSubjectsToBatchCourseRequest;
import com.campuscloud.academicservice.dto.request.CreateBatchCourseRequest;
import com.campuscloud.academicservice.dto.response.BatchCourseDTO;
import com.campuscloud.academicservice.dto.response.BatchCourseSubjectDTO;
import com.campuscloud.academicservice.entity.Batch;
import com.campuscloud.academicservice.entity.BatchCourse;
import com.campuscloud.academicservice.entity.BatchCourseSubject;
import com.campuscloud.academicservice.entity.Course;
import com.campuscloud.academicservice.entity.Subject;
import com.campuscloud.academicservice.exception.DuplicateResourceException;
import com.campuscloud.academicservice.exception.InvalidOperationException;
import com.campuscloud.academicservice.exception.ResourceNotFoundException;
import com.campuscloud.academicservice.repository.BatchCourseRepository;
import com.campuscloud.academicservice.repository.BatchCourseSubjectRepository;
import com.campuscloud.academicservice.repository.BatchRepository;
import com.campuscloud.academicservice.repository.CourseRepository;
import com.campuscloud.academicservice.repository.StudentEnrollmentRepository;
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
    private StudentEnrollmentRepository studentEnrollmentRepository;
    
    @Autowired
    private BatchCourseSubjectRepository batchCourseSubjectRepository;
    
    public List<BatchCourseDTO> getCoursesByBatch(Long batchId) {
        List<BatchCourse> batchCourses = batchCourseRepository.findByBatch_BatchId(batchId);
        
        return batchCourses.stream()
                .map(bc -> BatchCourseDTO.fromEntity(bc, true))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public BatchCourseDTO createBatchCourse(CreateBatchCourseRequest request) {
        log.info("Creating batch-course mapping for batch {} and course {}", request.getBatchId(), request.getCourseId());

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new InvalidOperationException("End date must be after start date");
        }

        Batch batch = batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found: " + request.getBatchId()));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + request.getCourseId()));

        if (batchCourseRepository.existsByBatch_BatchIdAndCourse_CourseId(request.getBatchId(), request.getCourseId())) {
            throw new DuplicateResourceException(
                    "Course " + course.getCourseCode() + " is already added to batch " + batch.getBatchName()
            );
        }

        BatchCourse batchCourse = BatchCourse.builder()
                .batch(batch)
                .course(course)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .batchCourseSubjects(new ArrayList<>())
                .studentEnrollments(new ArrayList<>())
                .build();

        BatchCourse saved = batchCourseRepository.save(batchCourse);
        return BatchCourseDTO.fromEntity(saved, true);
    }
    
    @Transactional
    public List<BatchCourseSubjectDTO> addSubjectsToBatchCourse(AddSubjectsToBatchCourseRequest request) {
        log.info("Adding subjects to batch {} and course {}", request.getBatchId(), request.getCourseId());
        
        // Validate batch and course
        batchRepository.findById(request.getBatchId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found: " + request.getBatchId()));
        
        courseRepository.findById(request.getCourseId())
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
    
    public BatchCourseDTO getBatchCourseById(Long batchCourseId) {
        BatchCourse batchCourse = batchCourseRepository.findWithDetailsById(batchCourseId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch-Course mapping not found: " + batchCourseId));

        BatchCourseDTO dto = BatchCourseDTO.fromEntity(batchCourse, true);
        Long activeCount = studentEnrollmentRepository.countActiveStudentsByBatchCourse(batchCourseId);
        dto.setTotalStudents(activeCount == null ? 0 : activeCount.intValue());
        return dto;
    }

    @Transactional
    public void deleteBatchCourse(Long batchCourseId) {
        BatchCourse batchCourse = batchCourseRepository.findById(batchCourseId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch-Course mapping not found: " + batchCourseId));
        batchCourseRepository.delete(batchCourse);
    }

    public List<BatchCourseSubjectDTO> getSubjectsByBatchCourseId(Long batchCourseId) {
        List<BatchCourseSubject> subjects = batchCourseSubjectRepository.findByBatchCourse_BatchCourseId(batchCourseId);
        return subjects.stream()
                .map(BatchCourseSubjectDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public BatchCourseSubjectDTO getBatchCourseSubjectById(Long batchCourseSubjectId) {
        BatchCourseSubject subject = batchCourseSubjectRepository.findWithDetailsById(batchCourseSubjectId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Batch-Course-Subject mapping not found: " + batchCourseSubjectId
                ));
        return BatchCourseSubjectDTO.fromEntity(subject);
    }

    @Transactional
    public void deleteBatchCourseSubject(Long batchCourseSubjectId) {
        BatchCourseSubject subject = batchCourseSubjectRepository.findById(batchCourseSubjectId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Batch-Course-Subject mapping not found: " + batchCourseSubjectId
                ));
        batchCourseSubjectRepository.delete(subject);
    }
}