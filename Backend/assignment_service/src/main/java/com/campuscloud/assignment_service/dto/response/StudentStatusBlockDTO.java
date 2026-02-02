package com.campuscloud.assignment_service.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentStatusBlockDTO {

    private Long total;
    private List<SubjectCountDTO> subjects;
}
