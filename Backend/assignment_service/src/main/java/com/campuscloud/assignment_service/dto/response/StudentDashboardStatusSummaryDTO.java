package com.campuscloud.assignment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDashboardStatusSummaryDTO {

    private StudentStatusBlockDTO pending;
    private StudentStatusBlockDTO submitted;
    private StudentStatusBlockDTO evaluated;
}
