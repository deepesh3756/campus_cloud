package com.campuscloud.academicservice.service;

import com.campuscloud.academicservice.dto.request.CreateBatchRequest;
import com.campuscloud.academicservice.entity.Batch;
import com.campuscloud.academicservice.entity.Course;
import com.campuscloud.academicservice.enums.BatchStatus;
import com.campuscloud.academicservice.repository.BatchRepository;
import com.campuscloud.academicservice.repository.BatchCourseRepository;
import com.campuscloud.academicservice.repository.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BatchServiceTest {

    @Mock
    private BatchRepository batchRepository;
    
    @Mock
    private CourseRepository courseRepository;
    
    @Mock
    private BatchCourseRepository batchCourseRepository;
    
    @InjectMocks
    private BatchService batchService;
    
    private CreateBatchRequest createBatchRequest;
    private Course testCourse;
    private Batch savedBatch;
    
    @BeforeEach
    void setUp() {
        createBatchRequest = CreateBatchRequest.builder()
                .batchName("AUG_2025")
                .startDate(LocalDate.of(2025, 8, 1))
                .endDate(LocalDate.of(2026, 2, 28))
                .description("August 2025 batch for all PG diploma courses")
                .courseIds(List.of(1L, 2L))
                .build();
        
        testCourse = Course.builder()
                .courseId(1L)
                .courseCode("PG-DAC")
                .courseName("PG-DAC")
                .durationMonths(6)
                .build();
        
        savedBatch = Batch.builder()
                .batchId(10L)
                .batchName("AUG_2025")
                .startDate(LocalDate.of(2025, 8, 1))
                .endDate(LocalDate.of(2026, 2, 28))
                .status(BatchStatus.UPCOMING)
                .description("August 2025 batch for all PG diploma courses")
                .build();
    }
    
    @Test
    void createBatch_Success() {
        // Given
        when(batchRepository.existsByBatchName("AUG_2025")).thenReturn(false);
        when(batchRepository.save(any(Batch.class))).thenReturn(savedBatch);
        when(courseRepository.findById(1L)).thenReturn(Optional.of(testCourse));
        when(courseRepository.findById(2L)).thenReturn(Optional.of(testCourse));
        when(batchCourseRepository.existsByBatch_BatchIdAndCourse_CourseId(any(), any())).thenReturn(false);
        
        // When
        var result = batchService.createBatch(createBatchRequest);
        
        // Then
        assertNotNull(result);
        assertEquals("AUG_2025", result.getBatchName());
        assertEquals(BatchStatus.UPCOMING, result.getStatus());
        assertEquals(2, result.getTotalCourses());
        
        verify(batchRepository).save(any(Batch.class));
        verify(batchCourseRepository, times(2)).save(any());
    }
    
    @Test
    void createBatch_BatchNameExists_ThrowsException() {
        // Given
        when(batchRepository.existsByBatchName("AUG_2025")).thenReturn(true);
        
        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> batchService.createBatch(createBatchRequest)
        );
        
        assertEquals("Batch with name 'AUG_2025' already exists", exception.getMessage());
        verify(batchRepository, never()).save(any());
    }
    
    @Test
    void createBatch_InvalidDates_ThrowsException() {
        // Given
        CreateBatchRequest invalidRequest = CreateBatchRequest.builder()
                .batchName("INVALID_BATCH")
                .startDate(LocalDate.of(2025, 8, 1))
                .endDate(LocalDate.of(2025, 7, 1)) // End date before start date
                .build();
        
        when(batchRepository.existsByBatchName("INVALID_BATCH")).thenReturn(false);
        
        // When & Then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> batchService.createBatch(invalidRequest)
        );
        
        assertEquals("Start date cannot be after end date", exception.getMessage());
        verify(batchRepository, never()).save(any());
    }
}
