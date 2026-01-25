package com.campuscloud.academicservice.dto.response;

import com.campuscloud.academicservice.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO{
    
    private Long courseId;
    private String courseCode;
    private String courseName;
    
    public static CourseDTO fromEntity(Course course) {
        return CourseDTO.builder()
                .courseId(course.getCourseId())
                .courseCode(course.getCourseCode())
                .courseName(course.getCourseName())
                .build();
    }
}