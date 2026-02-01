package com.campuscloud.notification_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Event DTO that will be published by Assignment Service when a new assignment
 * is created
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentCreatedEvent implements Serializable {

    private Long assignmentId;
    private Long batchCourseSubjectId;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private Long facultyId;
    private String facultyName;
}
