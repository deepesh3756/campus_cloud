package com.campuscloud.notification_service.listener;

import com.campuscloud.notification_service.client.AcademicServiceClient;
import com.campuscloud.notification_service.config.RabbitMQConfig;
import com.campuscloud.notification_service.dto.ApiResponse;
import com.campuscloud.notification_service.dto.AssignmentCreatedEvent;
import com.campuscloud.notification_service.dto.NotificationDTO;
import com.campuscloud.notification_service.entity.Notification;
import com.campuscloud.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AssignmentEventListener {

    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;
    private final AcademicServiceClient academicServiceClient;

    /**
     * Listen to assignment created events from RabbitMQ
     */
    @RabbitListener(queues = RabbitMQConfig.ASSIGNMENT_NOTIFICATION_QUEUE)
    public void handleAssignmentCreated(AssignmentCreatedEvent event) {
        log.info("Received assignment created event: {}", event);

        try {
            // Get subject name from Academic Service
            String subjectName = getSubjectName(event.getBatchCourseSubjectId());

            // Get list of students for this batch_course_subject
            List<Long> studentIds = getStudentsByBatchCourseSubject(event.getBatchCourseSubjectId());

            // Create notification for each student
            for (Long studentId : studentIds) {
                // Format the notification message
                String title = "New Assignment: " + event.getTitle();
                String dueDate = event.getDeadline().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm"));
                String message = String.join(";",
                        "New Assignment",
                        event.getTitle(),
                        subjectName,
                        dueDate);

                // Save notification to database
                Notification notification = notificationService.createNotification(
                        studentId,
                        "NEW_ASSIGNMENT",
                        title,
                        message,
                        event.getAssignmentId(),
                        "ASSIGNMENT");

                // Send real-time notification via WebSocket
                NotificationDTO dto = convertToDTO(notification);
                messagingTemplate.convertAndSend("/topic/notifications/" + studentId, dto);
                log.info("Sent notification to student {} via WebSocket", studentId);
            }

            log.info("Created notifications for {} students", studentIds.size());

        } catch (Exception e) {
            log.error("Error processing assignment created event", e);
        }
    }

    /**
     * Get subject name from batch_course_subject_id
     */
    private String getSubjectName(Long batchCourseSubjectId) {
        try {
            log.info("Fetching subject name for batch-course-subject: {}", batchCourseSubjectId);

            ApiResponse<Map<String, Object>> response = academicServiceClient
                    .getBatchCourseSubjectDetails(batchCourseSubjectId);

            if (response.isSuccess() && response.getData() != null) {
                Map<String, Object> data = response.getData();

                // Try to get subject name from nested subject object
                if (data.containsKey("subject") && data.get("subject") instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> subject = (Map<String, Object>) data.get("subject");
                    String subjectName = (String) subject.get("subjectName");
                    if (subjectName != null) {
                        log.info("Found subject name: {}", subjectName);
                        return subjectName;
                    }
                }

                // Fallback: try to get subjectName directly
                if (data.containsKey("subjectName")) {
                    String subjectName = (String) data.get("subjectName");
                    log.info("Found subject name (direct): {}", subjectName);
                    return subjectName;
                }

                log.warn("Subject name not found in response for batch-course-subject: {}", batchCourseSubjectId);
                return "Subject"; // Fallback default
            } else {
                log.warn("Failed to get batch-course-subject details: {}", batchCourseSubjectId);
                return "Subject"; // Fallback default
            }
        } catch (Exception e) {
            log.error("Error fetching subject name from Academic Service", e);
            return "Subject"; // Fallback default
        }
    }

    /**
     * Get students by batch_course_subject_id from Academic Service
     */
    private List<Long> getStudentsByBatchCourseSubject(Long batchCourseSubjectId) {
        try {
            log.info("Fetching enrolled students for batch-course-subject: {}", batchCourseSubjectId);

            ApiResponse<List<Long>> response = academicServiceClient
                    .getEnrolledStudentIds(batchCourseSubjectId);

            if (response.isSuccess() && response.getData() != null) {
                List<Long> studentIds = response.getData();
                log.info("Found {} enrolled students", studentIds.size());
                return studentIds;
            } else {
                log.warn("No students found for batch-course-subject: {}", batchCourseSubjectId);
                return Collections.emptyList();
            }
        } catch (Exception e) {
            log.error("Failed to fetch students from Academic Service", e);
            return Collections.emptyList();
        }
    }

    /**
     * Convert entity to DTO
     */
    private NotificationDTO convertToDTO(Notification notification) {
        return new NotificationDTO(
                notification.getId(),
                notification.getUserId(),
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getReferenceId(),
                notification.getReferenceType(),
                notification.getIsRead(),
                notification.getCreatedAt(),
                notification.getReadAt());
    }
}
