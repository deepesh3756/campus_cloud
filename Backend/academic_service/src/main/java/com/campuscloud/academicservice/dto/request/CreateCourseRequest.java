package com.campuscloud.academicservice.dto.request;

import com.campuscloud.academicservice.enums.CourseStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCourseRequest {
    
    @NotBlank(message = "Course code is required")
    @Size(max = 50, message = "Course code must not exceed 50 characters")
    private String courseCode;
    
    @NotBlank(message = "Course name is required")
    @Size(max = 200, message = "Course name must not exceed 200 characters")
    private String courseName;
    
    @Min(value = 1, message = "Duration must be at least 1 month")
    private Integer durationMonths;

    private CourseStatus status;
}