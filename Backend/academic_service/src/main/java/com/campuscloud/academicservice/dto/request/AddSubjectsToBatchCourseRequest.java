package com.campuscloud.academicservice.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddSubjectsToBatchCourseRequest {
    
    @NotNull(message = "Batch ID is required")
    private Long batchId;
    
    @NotNull(message = "Course ID is required")
    private Long courseId;
    
    @NotEmpty(message = "At least one subject ID is required")
    private List<Long> subjectIds;
}