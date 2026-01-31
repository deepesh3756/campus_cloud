package com.campuscloud.assignment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectCountDTO {

    private Long batchCourseSubjectId;
    private String subjectCode;
    private String subjectName;

    private Long count;
}
