package com.campuscloud.academicservice.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBatchCourseRequest {

    @NotNull
    private Long batchId;

    @NotNull
    private Long courseId;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;
}
