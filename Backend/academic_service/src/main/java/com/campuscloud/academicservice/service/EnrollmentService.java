package com.campuscloud.academicservice.service;



import com.campuscloud.academicservice.dto.request.EnrollStudentRequest;
import com.campuscloud.academicservice.dto.response.EnrollmentDTO;
import com.campuscloud.academicservice.entity.BatchCourse;
import com.campuscloud.academicservice.entity.StudentEnrollment;
import com.campuscloud.academicservice.enums.StudentEnrollmentStatus;
import com.campuscloud.academicservice.exception.DuplicateResourceException;
import com.campuscloud.academicservice.exception.ResourceNotFoundException;
import com.campuscloud.academicservice.repository.BatchCourseRepository;
import com.campuscloud.academicservice.repository.StudentEnrollmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class EnrollmentService {
    
    @Autowired
    private StudentEnrollmentRepository enrollmentRepository;
    
    @Autowired
    private BatchCourseRepository batchCourseRepository;
    
    @Transactional
    public EnrollmentDTO enrollStudent(EnrollStudentRequest request) {
        log.info("Enrolling student {} in batch {} and course {}", 
                request.getUserId(), request.getBatchId(), request.getCourseId());
        
        // Find batch-course mapping
        BatchCourse batchCourse = batchCourseRepository
                .findByBatch_BatchIdAndCourse_CourseId(request.getBatchId(), request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Batch-Course mapping not found for batch " + request.getBatchId() + 
                    " and course " + request.getCourseId()
                ));
        
        // Check if already enrolled
        if (enrollmentRepository.existsByUserIdAndBatchCourse_BatchCourseId(
                request.getUserId(), batchCourse.getBatchCourseId())) {
            throw new DuplicateResourceException(
                "Student already enrolled in this batch-course combination"
            );
        }
        
        // Create enrollment
        StudentEnrollment enrollment = StudentEnrollment.builder()
                .userId(request.getUserId())
                .batchCourse(batchCourse)
                .status(StudentEnrollmentStatus.ACTIVE)
                .build();
        
        StudentEnrollment savedEnrollment = enrollmentRepository.save(enrollment);
        log.info("Student enrolled successfully: enrollment ID {}", savedEnrollment.getEnrollmentId());
        
        return EnrollmentDTO.fromEntity(savedEnrollment);
    }
    
    public List<EnrollmentDTO> getStudentEnrollments(Long userId) {
        List<StudentEnrollment> enrollments = enrollmentRepository
                .findActiveEnrollmentsByUserId(userId, StudentEnrollmentStatus.ACTIVE);
        
        return enrollments.stream()
                .map(EnrollmentDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<Long> getEnrolledStudentIds(Long batchCourseId) {
        List<StudentEnrollment> enrollments = enrollmentRepository
                .findByBatchCourse_BatchCourseId(batchCourseId);
        
        return enrollments.stream()
                .filter(e -> e.getStatus() == StudentEnrollmentStatus.ACTIVE)
                .map(StudentEnrollment::getUserId)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public EnrollmentDTO updateEnrollmentStatus(Long enrollmentId, StudentEnrollmentStatus status) {
        StudentEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found: " + enrollmentId));
        
        enrollment.setStatus(status);
        StudentEnrollment updated = enrollmentRepository.save(enrollment);
        
        return EnrollmentDTO.fromEntity(updated);
    }
}
