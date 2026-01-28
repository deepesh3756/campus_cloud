package com.campuscloud.academicservice.dto.response;

import com.campuscloud.academicservice.entity.Subject;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectDTO {
    
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static SubjectDTO fromEntity(Subject subject) {
        return SubjectDTO.builder()
                .subjectId(subject.getSubjectId())
                .subjectCode(subject.getSubjectCode())
                .subjectName(subject.getSubjectName())
                .createdAt(subject.getCreatedAt())
                .updatedAt(subject.getUpdatedAt())
                .build();
    }
}