package com.campuscloud.assignment_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Event DTO published when a new assignment is created
 * Must match the DTO in Notification Service
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
