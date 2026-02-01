package com.campuscloud.notification_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_user_read", columnList = "userId,isRead"),
        @Index(name = "idx_created_at", columnList = "createdAt"),
        @Index(name = "idx_reference", columnList = "referenceType,referenceId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId; // Student ID who should receive this notification

    @Column(nullable = false, length = 50)
    private String type; // NEW_ASSIGNMENT, DEADLINE_REMINDER, etc.

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private Long referenceId; // Assignment ID

    @Column(length = 50)
    private String referenceType; // ASSIGNMENT, SUBMISSION, etc.

    @Column(nullable = false)
    private Boolean isRead = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime readAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (isRead == null) {
            isRead = false;
        }
    }
}
