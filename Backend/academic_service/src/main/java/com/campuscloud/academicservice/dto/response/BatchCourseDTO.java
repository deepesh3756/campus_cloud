package com.campuscloud.academicservice.dto.response;

import com.campuscloud.academicservice.entity.BatchCourse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchCourseDTO {
    
    private Long batchCourseId;
    private Long batchId;
    private String batchName;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer totalSubjects;
    private Integer totalStudents;
    private List<SubjectDTO> subjects;
    
    public static BatchCourseDTO fromEntity(BatchCourse batchCourse, boolean includeSubjects) {
        BatchCourseDTOBuilder builder = BatchCourseDTO.builder()
                .batchCourseId(batchCourse.getBatchCourseId())
                .batchId(batchCourse.getBatch().getBatchId())
                .batchName(batchCourse.getBatch().getBatchName())
                .courseId(batchCourse.getCourse().getCourseId())
                .courseCode(batchCourse.getCourse().getCourseCode())
                .courseName(batchCourse.getCourse().getCourseName())
                .startDate(batchCourse.getStartDate())
                .endDate(batchCourse.getEndDate());
        
        if (batchCourse.getBatchCourseSubjects() != null) {
            builder.totalSubjects(batchCourse.getBatchCourseSubjects().size());
            
            if (includeSubjects) {
                List<SubjectDTO> subjectDTOs = batchCourse.getBatchCourseSubjects().stream()
                        .map(bcs -> SubjectDTO.fromEntity(bcs.getSubject()))
                        .collect(Collectors.toList());
                builder.subjects(subjectDTOs);
            }
        }
        
        if (batchCourse.getStudentEnrollments() != null) {
            builder.totalStudents(batchCourse.getStudentEnrollments().size());
        }
        
        return builder.build();
    }
}