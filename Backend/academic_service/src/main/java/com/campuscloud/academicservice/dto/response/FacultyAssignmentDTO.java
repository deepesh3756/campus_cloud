package com.campuscloud.academicservice.dto.response;

import com.campuscloud.academicservice.entity.FacultyAssignment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacultyAssignmentDTO {
    
    private Long assignmentId;
    private Long userId;
    private Long batchCourseSubjectId;
    private String batchName;
    private String courseCode;
    private String courseName;
    private String subjectCode;
    private String subjectName;
    private LocalDate assignedDate;
    private String status;
    
    public static FacultyAssignmentDTO fromEntity(FacultyAssignment assignment) {
        return FacultyAssignmentDTO.builder()
                .assignmentId(assignment.getAssignmentId())
                .userId(assignment.getUserId())
                .batchCourseSubjectId(assignment.getBatchCourseSubject().getBatchCourseSubjectId())
                .batchName(assignment.getBatchCourseSubject().getBatchCourse().getBatch().getBatchName())
                .courseCode(assignment.getBatchCourseSubject().getBatchCourse().getCourse().getCourseCode())
                .courseName(assignment.getBatchCourseSubject().getBatchCourse().getCourse().getCourseName())
                .subjectCode(assignment.getBatchCourseSubject().getSubject().getSubjectCode())
                .subjectName(assignment.getBatchCourseSubject().getSubject().getSubjectName())
                .assignedDate(assignment.getAssignedDate())
                .status(assignment.getStatus().name())
                .build();
    }
}