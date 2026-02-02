package com.campuscloud.academicservice.dto.request;

import com.campuscloud.academicservice.enums.BatchStatus;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBatchRequest {
    
    @Size(min = 2, max = 100)
    private String batchName;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private BatchStatus status;
    
    private String description;

    private List<Long> courseIds;
}