package com.campuscloud.academicservice.dto.response;

import com.campuscloud.academicservice.entity.BatchCourseSubject;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchCourseSubjectDTO {
    
    private Long batchCourseSubjectId;
    private Long batchId;
    private String batchName;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    
    public static BatchCourseSubjectDTO fromEntity(BatchCourseSubject bcs) {
        return BatchCourseSubjectDTO.builder()
                .batchCourseSubjectId(bcs.getBatchCourseSubjectId())
                .batchId(bcs.getBatchCourse().getBatch().getBatchId())
                .batchName(bcs.getBatchCourse().getBatch().getBatchName())
                .courseId(bcs.getBatchCourse().getCourse().getCourseId())
                .courseCode(bcs.getBatchCourse().getCourse().getCourseCode())
                .courseName(bcs.getBatchCourse().getCourse().getCourseName())
                .subjectId(bcs.getSubject().getSubjectId())
                .subjectCode(bcs.getSubject().getSubjectCode())
                .subjectName(bcs.getSubject().getSubjectName())
                .build();
    }
}