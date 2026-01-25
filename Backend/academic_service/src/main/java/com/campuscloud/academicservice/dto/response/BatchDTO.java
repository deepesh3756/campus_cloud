package com.campuscloud.academicservice.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.campuscloud.academicservice.entity.Batch;
import com.campuscloud.academicservice.enums.BatchStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchDTO {
    
    private Long batchId;
    private String batchName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BatchStatus status;
    private String description;
    private Integer totalCourses;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CourseDTO> courses;
    
    public static BatchDTO fromEntity(Batch batch, boolean includeCourses) {
        BatchDTOBuilder builder = BatchDTO.builder()
                .batchId(batch.getBatchId())
                .batchName(batch.getBatchName())
                .startDate(batch.getStartDate())
                .endDate(batch.getEndDate())
                .status(batch.getStatus())
                .description(batch.getDescription())
                .createdAt(batch.getCreatedAt())
                .updatedAt(batch.getUpdatedAt());
        
        if (batch.getBatchCourses() != null) {
            builder.totalCourses(batch.getBatchCourses().size());
            
            if (includeCourses) {
                List<CourseDTO> courseDTOs = batch.getBatchCourses().stream()
                        .map(bc -> CourseDTO.fromEntity(bc.getCourse()))
                        .collect(Collectors.toList());
                builder.courses(courseDTOs);
            }
        }
        
        return builder.build();
    }
}