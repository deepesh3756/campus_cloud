package com.campuscloud.assignment_service.dto.request;


import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluateSubmissionRequest {

    @NotNull(message = "Grade is required")
    @Min(value = 1, message = "Grade must be at least 1")
    @Max(value = 10, message = "Grade must not exceed 10")
    private Integer grade;

    @Size(max = 1000, message = "Remarks must not exceed 1000 characters")
    private String remarks;
    
}
