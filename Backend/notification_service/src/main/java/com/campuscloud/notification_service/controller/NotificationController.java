package com.campuscloud.notification_service.controller;

import com.campuscloud.notification_service.dto.ApiResponse;
import com.campuscloud.notification_service.dto.NotificationDTO;
import com.campuscloud.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Get all notifications for a user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getUserNotifications(@PathVariable Long userId) {
        log.info("Fetching notifications for user: {}", userId);
        List<NotificationDTO> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved successfully", notifications));
    }

    /**
     * Get unread notifications for a user
     */
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getUnreadNotifications(@PathVariable Long userId) {
        log.info("Fetching unread notifications for user: {}", userId);
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(ApiResponse.success("Unread notifications retrieved successfully", notifications));
    }

    /**
     * Get unread notification count
     */
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(@PathVariable Long userId) {
        log.info("Fetching unread count for user: {}", userId);
        Long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success("Unread count retrieved successfully", Map.of("count", count)));
    }

    /**
     * Mark a notification as read
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<NotificationDTO>> markAsRead(@PathVariable Long notificationId) {
        log.info("Marking notification {} as read", notificationId);
        NotificationDTO notification = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", notification));
    }

    /**
     * Mark all notifications as read for a user
     */
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<ApiResponse<String>> markAllAsRead(@PathVariable Long userId) {
        log.info("Marking all notifications as read for user: {}", userId);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", "Success"));
    }
}
