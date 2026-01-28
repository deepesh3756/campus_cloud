package com.campuscloud.academicservice.dto.response;

import com.campuscloud.academicservice.entity.Course;
import com.campuscloud.academicservice.enums.CourseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    
    private Long courseId;
    private String courseCode;
    private String courseName;
    private Integer durationMonths;
    private CourseStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static CourseDTO fromEntity(Course course) {
        return CourseDTO.builder()
                .courseId(course.getCourseId())
                .courseCode(course.getCourseCode())
                .courseName(course.getCourseName())
                .durationMonths(course.getDurationMonths())
                .status(course.getStatus())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}