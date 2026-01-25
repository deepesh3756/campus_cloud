package com.campuscloud.academicservice.controller;

import com.campuscloud.academicservice.dto.request.CreateBatchRequest;
import com.campuscloud.academicservice.dto.response.ApiResponse;
import com.campuscloud.academicservice.dto.response.BatchDTO;
import com.campuscloud.academicservice.enums.BatchStatus;
import com.campuscloud.academicservice.service.BatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic/batches")
@RequiredArgsConstructor
@Slf4j
public class BatchController {

    private final BatchService batchService;

    @PostMapping
    public ResponseEntity<ApiResponse<BatchDTO>> createBatch(
            @Valid @RequestBody CreateBatchRequest request) {
        
        log.info("Creating batch: {}", request.getBatchName());
        
        BatchDTO createdBatch = batchService.createBatch(request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Batch created successfully", createdBatch));
    }

    @GetMapping("/{batchId}")
    public ResponseEntity<ApiResponse<BatchDTO>> getBatchById(
            @PathVariable Long batchId) {
        
        log.info("Fetching batch with ID: {}", batchId);
        
        BatchDTO batch = batchService.getBatchById(batchId);
        
        return ResponseEntity.ok(ApiResponse.success(batch));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BatchDTO>>> getAllBatches() {
        log.info("Fetching all batches");
        
        List<BatchDTO> batches = batchService.getAllBatches();
        
        return ResponseEntity.ok(ApiResponse.success(batches));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<BatchDTO>>> getBatchesByStatus(
            @PathVariable BatchStatus status) {
        
        log.info("Fetching batches with status: {}", status);
        
        List<BatchDTO> batches = batchService.getBatchesByStatus(status);
        
        return ResponseEntity.ok(ApiResponse.success(batches));
    }
}
