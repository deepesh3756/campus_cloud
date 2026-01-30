package com.campuscloud.academicservice.service;

import com.campuscloud.academicservice.dto.request.CreateBatchRequest;
import com.campuscloud.academicservice.dto.request.UpdateBatchRequest;
import com.campuscloud.academicservice.dto.response.BatchDTO;
import com.campuscloud.academicservice.entity.Batch;
import com.campuscloud.academicservice.entity.BatchCourse;
import com.campuscloud.academicservice.entity.Course;
import com.campuscloud.academicservice.enums.BatchStatus;
import com.campuscloud.academicservice.exception.DuplicateResourceException;
import com.campuscloud.academicservice.exception.InvalidOperationException;
import com.campuscloud.academicservice.exception.ResourceNotFoundException;
import com.campuscloud.academicservice.repository.BatchCourseSubjectRepository;
import com.campuscloud.academicservice.repository.BatchRepository;
import com.campuscloud.academicservice.repository.CourseRepository;
import com.campuscloud.academicservice.repository.StudentEnrollmentRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class BatchService {
    
    @Autowired
    private BatchRepository batchRepository;
    
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private BatchCourseSubjectRepository batchCourseSubjectRepository;

    @Autowired
    private StudentEnrollmentRepository studentEnrollmentRepository;
    
    @Transactional
    public BatchDTO createBatch(CreateBatchRequest request) {
        log.info("Creating batch: {}", request.getBatchName());
        
        // Check if batch already exists
        if (batchRepository.existsByBatchName(request.getBatchName())) {
            throw new DuplicateResourceException("Batch already exists: " + request.getBatchName());
        }
        
        // Validate dates
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new InvalidOperationException("End date must be after start date");
        }
        
        // Create batch
        Batch batch = Batch.builder()
                .batchName(request.getBatchName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .status(BatchStatus.UPCOMING)
                .batchCourses(new ArrayList<>())
                .build();
        
        // Add courses if provided
        if (request.getCourseIds() != null && !request.getCourseIds().isEmpty()) {
            for (Long courseId : request.getCourseIds()) {
                Course course = courseRepository.findById(courseId)
                        .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));
                
                BatchCourse batchCourse = BatchCourse.builder()
                        .batch(batch)
                        .course(course)
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .batchCourseSubjects(new ArrayList<>())
                        .studentEnrollments(new ArrayList<>())
                        .build();
                
                batch.getBatchCourses().add(batchCourse);
            }
        }
        
        Batch savedBatch = batchRepository.save(batch);
        log.info("Batch created successfully: {}", savedBatch.getBatchId());
        
        return BatchDTO.fromEntity(savedBatch, true);
    }
    
    public BatchDTO getBatchById(Long batchId) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found: " + batchId));
        return BatchDTO.fromEntity(batch, true);
    }
    
    public List<BatchDTO> getAllBatches(BatchStatus status) {
        List<Batch> batches;
        
        if (status != null) {
            batches = batchRepository.findByStatus(status);
        } else {
            batches = batchRepository.findByOrderByCreatedAtDesc();
        }
        
        return batches.stream()
                .map(batch -> BatchDTO.fromEntity(batch, false))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public BatchDTO updateBatch(Long batchId, UpdateBatchRequest request) {
        log.info("Updating batch: {}", batchId);
        
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found: " + batchId));

        LocalDate nextStartDate = request.getStartDate() != null ? request.getStartDate() : batch.getStartDate();
        LocalDate nextEndDate = request.getEndDate() != null ? request.getEndDate() : batch.getEndDate();

        if (nextEndDate.isBefore(nextStartDate)) {
            throw new InvalidOperationException("End date must be after start date");
        }
        
        if (request.getBatchName() != null) {
            if (!request.getBatchName().equals(batch.getBatchName()) &&
                batchRepository.existsByBatchName(request.getBatchName())) {
                throw new DuplicateResourceException("Batch name already exists: " + request.getBatchName());
            }
            batch.setBatchName(request.getBatchName());
        }
        
        if (request.getStartDate() != null) {
            batch.setStartDate(request.getStartDate());
        }
        
        if (request.getEndDate() != null) {
            batch.setEndDate(request.getEndDate());
        }
        
        if (request.getStatus() != null) {
            batch.setStatus(request.getStatus());
        }
        
        if (request.getDescription() != null) {
            batch.setDescription(request.getDescription());
        }

        if (request.getCourseIds() != null) {
            Set<Long> desiredCourseIds = new HashSet<>(request.getCourseIds());
            Map<Long, BatchCourse> existingByCourseId = new HashMap<>();
            for (BatchCourse bc : batch.getBatchCourses()) {
                if (bc.getCourse() != null && bc.getCourse().getCourseId() != null) {
                    existingByCourseId.put(bc.getCourse().getCourseId(), bc);
                }
            }

            for (BatchCourse existing : List.copyOf(batch.getBatchCourses())) {
                Long courseId = existing.getCourse() != null ? existing.getCourse().getCourseId() : null;
                if (courseId == null) continue;

                if (!desiredCourseIds.contains(courseId)) {
                    Long batchCourseId = existing.getBatchCourseId();
                    if (batchCourseId != null) {
                        boolean hasSubjects = batchCourseSubjectRepository.existsByBatchCourse_BatchCourseId(batchCourseId);
                        boolean hasEnrollments = studentEnrollmentRepository.existsByBatchCourse_BatchCourseId(batchCourseId);

                        if (hasSubjects || hasEnrollments) {
                            throw new InvalidOperationException(
                                    "Cannot remove course " + existing.getCourse().getCourseCode() +
                                    " from batch because it has " +
                                    (hasEnrollments ? "enrollments" : "subjects")
                            );
                        }
                    }

                    batch.getBatchCourses().remove(existing);
                }
            }

            for (Long desiredCourseId : desiredCourseIds) {
                if (desiredCourseId == null) continue;
                if (existingByCourseId.containsKey(desiredCourseId)) continue;

                Course course = courseRepository.findById(desiredCourseId)
                        .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + desiredCourseId));

                BatchCourse batchCourse = BatchCourse.builder()
                        .batch(batch)
                        .course(course)
                        .startDate(batch.getStartDate())
                        .endDate(batch.getEndDate())
                        .batchCourseSubjects(new ArrayList<>())
                        .studentEnrollments(new ArrayList<>())
                        .build();

                batch.getBatchCourses().add(batchCourse);
            }
        }

        if (request.getStartDate() != null || request.getEndDate() != null) {
            for (BatchCourse bc : batch.getBatchCourses()) {
                bc.setStartDate(batch.getStartDate());
                bc.setEndDate(batch.getEndDate());
            }
        }
        
        Batch updatedBatch = batchRepository.save(batch);
        log.info("Batch updated successfully: {}", batchId);
        
        return BatchDTO.fromEntity(updatedBatch, true);
    }
    
    @Transactional
    public void deleteBatch(Long batchId) {
        log.info("Deleting batch: {}", batchId);
        
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found: " + batchId));
        batchRepository.delete(batch);
        log.info("Batch deleted successfully: {}", batchId);
    }
}