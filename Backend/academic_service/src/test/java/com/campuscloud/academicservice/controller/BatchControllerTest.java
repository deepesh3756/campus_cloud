package com.campuscloud.academicservice.controller;

import com.campuscloud.academicservice.dto.request.CreateBatchRequest;
import com.campuscloud.academicservice.dto.response.ApiResponse;
import com.campuscloud.academicservice.dto.response.BatchDTO;
import com.campuscloud.academicservice.service.BatchService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BatchControllerTest {

    @Mock
    private BatchService batchService;
    
    @InjectMocks
    private BatchController batchController;
    
    @Test
    void createBatch_Success() {
        // Given
        CreateBatchRequest request = CreateBatchRequest.builder()
                .batchName("AUG_2025")
                .startDate(LocalDate.of(2025, 8, 1))
                .endDate(LocalDate.of(2026, 2, 28))
                .description("August 2025 batch")
                .courseIds(List.of(1L, 2L))
                .build();
        
        BatchDTO mockResponse = BatchDTO.builder()
                .batchId(10L)
                .batchName("AUG_2025")
                .startDate(LocalDate.of(2025, 8, 1))
                .endDate(LocalDate.of(2026, 2, 28))
                .description("August 2025 batch")
                .totalCourses(2)
                .build();
        
        when(batchService.createBatch(any(CreateBatchRequest.class))).thenReturn(mockResponse);
        
        // When
        ResponseEntity<ApiResponse<BatchDTO>> response = batchController.createBatch(request);
        
        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("Batch created successfully", response.getBody().getMessage());
        assertEquals(10L, response.getBody().getData().getBatchId());
        assertEquals("AUG_2025", response.getBody().getData().getBatchName());
        assertEquals(2, response.getBody().getData().getTotalCourses());
        
        verify(batchService).createBatch(any(CreateBatchRequest.class));
    }
    
    @Test
    void getBatchById_Success() {
        // Given
        Long batchId = 10L;
        BatchDTO mockBatch = BatchDTO.builder()
                .batchId(batchId)
                .batchName("AUG_2025")
                .build();
        
        when(batchService.getBatchById(batchId)).thenReturn(mockBatch);
        
        // When
        ResponseEntity<ApiResponse<BatchDTO>> response = batchController.getBatchById(batchId);
        
        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals(batchId, response.getBody().getData().getBatchId());
        
        verify(batchService).getBatchById(batchId);
    }
}
