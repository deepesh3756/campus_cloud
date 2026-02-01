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
            // TODO: Call Academic Service to get list of students for this
            // batch_course_subject
            // For now, using hardcoded student IDs for testing
            List<Long> studentIds = getStudentsByBatchCourseSubject(event.getBatchCourseSubjectId());

            // Create notification for each student
            for (Long studentId : studentIds) {
                // Format the notification message
                String title = "New Assignment: " + event.getTitle();
                String message = String.format("%s has assigned \"%s\". Deadline: %s",
                        event.getFacultyName(),
                        event.getTitle(),
                        event.getDeadline().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm")));

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
