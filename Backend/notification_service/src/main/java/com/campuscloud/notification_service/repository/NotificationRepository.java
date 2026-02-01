package com.campuscloud.notification_service.repository;

import com.campuscloud.notification_service.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Find all notifications for a specific user, ordered by newest first
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Find unread notifications for a specific user
    List<Notification> findByUserIdAndIsReadOrderByCreatedAtDesc(Long userId, Boolean isRead);

    // Count unread notifications for a user
    Long countByUserIdAndIsRead(Long userId, Boolean isRead);

    // Find notifications by reference (e.g., all notifications for a specific
    // assignment)
    List<Notification> findByReferenceTypeAndReferenceId(String referenceType, Long referenceId);
}
