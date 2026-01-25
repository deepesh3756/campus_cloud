package com.campuscloud.academicservice.service;

import com.campuscloud.academicservice.dto.request.CreateBatchRequest;
import com.campuscloud.academicservice.dto.response.BatchDTO;
import com.campuscloud.academicservice.entity.Batch;
import com.campuscloud.academicservice.entity.BatchCourse;
import com.campuscloud.academicservice.entity.Course;
import com.campuscloud.academicservice.enums.BatchStatus;
import com.campuscloud.academicservice.repository.BatchRepository;
import com.campuscloud.academicservice.repository.BatchCourseRepository;
import com.campuscloud.academicservice.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BatchService {

    private final BatchRepository batchRepository;
    private final CourseRepository courseRepository;
    private final BatchCourseRepository batchCourseRepository;

    public BatchDTO createBatch(CreateBatchRequest request) {
        log.info("Creating batch with name: {}", request.getBatchName());

        // Check if batch name already exists
        if (batchRepository.existsByBatchName(request.getBatchName())) {
            throw new IllegalArgumentException("Batch with name '" + request.getBatchName() + "' already exists");
        }

        // Validate dates
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        // Create and save batch
        Batch batch = Batch.builder()
                .batchName(request.getBatchName())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .status(BatchStatus.UPCOMING)
                .batchCourses(new ArrayList<>())
                .build();

        batch = batchRepository.save(batch);

        // Add courses to batch if provided
        if (request.getCourseIds() != null && !request.getCourseIds().isEmpty()) {
            addCoursesToBatch(batch, request.getCourseIds());
        }

        log.info("Successfully created batch with ID: {}", batch.getBatchId());
        return BatchDTO.fromEntity(batch, true);
    }

    private void addCoursesToBatch(Batch batch, List<Long> courseIds) {
        for (Long courseId : courseIds) {
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new IllegalArgumentException("Course with ID " + courseId + " not found"));

            // Check if course is already added to batch
            if (batchCourseRepository.existsByBatch_BatchIdAndCourse_CourseId(batch.getBatchId(), courseId)) {
                log.warn("Course {} is already added to batch {}", courseId, batch.getBatchId());
                continue;
            }

            // Create batch-course relationship
            BatchCourse batchCourse = BatchCourse.builder()
                    .batch(batch)
                    .course(course)
                    .startDate(batch.getStartDate())
                    .endDate(batch.getEndDate())
                    .build();

            batchCourseRepository.save(batchCourse);
            batch.getBatchCourses().add(batchCourse);
        }
    }

    @Transactional(readOnly = true)
    public BatchDTO getBatchById(Long batchId) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Batch with ID " + batchId + " not found"));
        return BatchDTO.fromEntity(batch, true);
    }

    @Transactional(readOnly = true)
    public List<BatchDTO> getAllBatches() {
        List<Batch> batches = batchRepository.findByOrderByCreatedAtDesc();
        return batches.stream()
                .map(batch -> BatchDTO.fromEntity(batch, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BatchDTO> getBatchesByStatus(BatchStatus status) {
        List<Batch> batches = batchRepository.findByStatus(status);
        return batches.stream()
                .map(batch -> BatchDTO.fromEntity(batch, false))
                .toList();
    }
}
