package com.campuscloud.notification_service.controller;

import com.campuscloud.notification_service.dto.ApiResponse;
import com.campuscloud.notification_service.dto.NotificationDTO;
import com.campuscloud.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class NotificationController {

    private final NotificationService notificationService;

    private static final String HEADER_USER_ID = "X-User-Id";

    private Long getRequesterUserId(HttpServletRequest request) {
        if (request == null) {
            return null;
        }
        String raw = request.getHeader(HEADER_USER_ID);
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            return Long.valueOf(raw.trim());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private boolean isAdmin(Authentication authentication) {
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }
        for (GrantedAuthority a : authentication.getAuthorities()) {
            if (a == null || a.getAuthority() == null) {
                continue;
            }
            String auth = a.getAuthority().trim();
            if (auth.equalsIgnoreCase("ROLE_ADMIN") || auth.equalsIgnoreCase("ROLE_admin")) {
                return true;
            }
        }
        return false;
    }

    private void assertCanAccessUser(Long targetUserId, Long requesterUserId, boolean admin) {
        if (admin) {
            return;
        }
        if (targetUserId == null || requesterUserId == null || !targetUserId.equals(requesterUserId)) {
            throw new org.springframework.security.access.AccessDeniedException("Forbidden");
        }
    }

    /**
     * Get all notifications for a user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getUserNotifications(
            @PathVariable Long userId,
            HttpServletRequest request,
            Authentication authentication
    ) {
        assertCanAccessUser(userId, getRequesterUserId(request), isAdmin(authentication));
        log.info("Fetching notifications for user: {}", userId);
        List<NotificationDTO> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved successfully", notifications));
    }

    /**
     * Get unread notifications for a user
     */
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getUnreadNotifications(
            @PathVariable Long userId,
            HttpServletRequest request,
            Authentication authentication
    ) {
        assertCanAccessUser(userId, getRequesterUserId(request), isAdmin(authentication));
        log.info("Fetching unread notifications for user: {}", userId);
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(ApiResponse.success("Unread notifications retrieved successfully", notifications));
    }

    /**
     * Get unread notification count
     */
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @PathVariable Long userId,
            HttpServletRequest request,
            Authentication authentication
    ) {
        assertCanAccessUser(userId, getRequesterUserId(request), isAdmin(authentication));
        log.info("Fetching unread count for user: {}", userId);
        Long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success("Unread count retrieved successfully", Map.of("count", count)));
    }

    /**
     * Mark a notification as read
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<NotificationDTO>> markAsRead(
            @PathVariable Long notificationId,
            HttpServletRequest request,
            Authentication authentication
    ) {
        log.info("Marking notification {} as read", notificationId);
        Long requesterUserId = getRequesterUserId(request);
        boolean admin = isAdmin(authentication);
        NotificationDTO notification = notificationService.markAsRead(notificationId, requesterUserId, admin);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", notification));
    }

    /**
     * Mark all notifications as read for a user
     */
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<ApiResponse<String>> markAllAsRead(
            @PathVariable Long userId,
            HttpServletRequest request,
            Authentication authentication
    ) {
        assertCanAccessUser(userId, getRequesterUserId(request), isAdmin(authentication));
        log.info("Marking all notifications as read for user: {}", userId);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", "Success"));
    }
}
