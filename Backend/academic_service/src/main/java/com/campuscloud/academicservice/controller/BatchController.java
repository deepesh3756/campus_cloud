package com.campuscloud.academicservice.controller;

import com.campuscloud.academicservice.dto.request.CreateBatchRequest;
import com.campuscloud.academicservice.dto.request.UpdateBatchRequest;
import com.campuscloud.academicservice.dto.response.ApiResponse;
import com.campuscloud.academicservice.dto.response.BatchDTO;
import com.campuscloud.academicservice.enums.BatchStatus;
import com.campuscloud.academicservice.service.BatchService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic/batches")
@Slf4j
public class BatchController {
    
    @Autowired
    private BatchService batchService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<BatchDTO>> createBatch(@Valid @RequestBody CreateBatchRequest request) {
        log.info("Create batch request: {}", request.getBatchName());
        BatchDTO batch = batchService.createBatch(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Batch created successfully", batch));
    }
    
    @GetMapping("/{batchId}")
    public ResponseEntity<ApiResponse<BatchDTO>> getBatchById(@PathVariable Long batchId) {
        log.info("Get batch request: {}", batchId);
        BatchDTO batch = batchService.getBatchById(batchId);
        return ResponseEntity.ok(ApiResponse.success(batch));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<BatchDTO>>> getAllBatches(
            @RequestParam(required = false) BatchStatus status) {
        log.info("Get all batches request with status: {}", status);
        List<BatchDTO> batches = batchService.getAllBatches(status);
        return ResponseEntity.ok(ApiResponse.success(batches));
    }
    
    @PutMapping("/{batchId}")
    public ResponseEntity<ApiResponse<BatchDTO>> updateBatch(
            @PathVariable Long batchId,
            @Valid @RequestBody UpdateBatchRequest request) {
        log.info("Update batch request: {}", batchId);
        BatchDTO batch = batchService.updateBatch(batchId, request);
        return ResponseEntity.ok(ApiResponse.success("Batch updated successfully", batch));
    }
    
    @DeleteMapping("/{batchId}")
    public ResponseEntity<ApiResponse<Void>> deleteBatch(@PathVariable Long batchId) {
        log.info("Delete batch request: {}", batchId);
        batchService.deleteBatch(batchId);
        return ResponseEntity.ok(ApiResponse.success("Batch deleted successfully", null));
    }
}