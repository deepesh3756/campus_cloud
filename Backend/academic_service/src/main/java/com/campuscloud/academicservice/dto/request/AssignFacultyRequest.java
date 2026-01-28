package com.campuscloud.academicservice.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignFacultyRequest {
    
    @NotNull(message = "Faculty user ID is required")
    private Long userId;
    
    @NotNull(message = "Batch ID is required")
    private Long batchId;
    
    @NotNull(message = "Course ID is required")
    private Long courseId;
    
    @NotNull(message = "Subject ID is required")
    private Long subjectId;
}