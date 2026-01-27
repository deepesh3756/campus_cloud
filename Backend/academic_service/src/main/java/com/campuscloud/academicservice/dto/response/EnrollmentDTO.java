package com.campuscloud.academicservice.dto.response;

import com.campuscloud.academicservice.entity.StudentEnrollment;
import com.campuscloud.academicservice.enums.StudentEnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDTO {
    
    private Long enrollmentId;
    private Long userId;
    private Long batchCourseId;
    private String batchName;
    private String courseCode;
    private String courseName;
    private LocalDate enrollmentDate;
    private StudentEnrollmentStatus status;
    
    public static EnrollmentDTO fromEntity(StudentEnrollment enrollment) {
        return EnrollmentDTO.builder()
                .enrollmentId(enrollment.getEnrollmentId())
                .userId(enrollment.getUserId())
                .batchCourseId(enrollment.getBatchCourse().getBatchCourseId())
                .batchName(enrollment.getBatchCourse().getBatch().getBatchName())
                .courseCode(enrollment.getBatchCourse().getCourse().getCourseCode())
                .courseName(enrollment.getBatchCourse().getCourse().getCourseName())
                .enrollmentDate(enrollment.getEnrollmentDate())
                .status(enrollment.getStatus())
                .build();
    }
}