package com.campuscloud.academicservice.dto.request;

import com.campuscloud.academicservice.enums.CourseStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCourseRequest {
    
    @Size(max = 50)
    private String courseCode;
    
    @Size(max = 200)
    private String courseName;
    
    @Min(1)
    private Integer durationMonths;
    
    private CourseStatus status;
}