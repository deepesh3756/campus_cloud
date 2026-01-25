package com.campuscloud.academicservice.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.campuscloud.academicservice.enums.StudentEnrollmentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Stores student enrollment in a batch-course
 * user_id comes from User Service (no FK due to microservice boundary)
 */
@Entity
@Table(
    name = "student_enrollments",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_user_batch_course",
            columnNames = {"user_id", "batch_course_id"}
        )
    },
    indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_batch_course_id", columnList = "batch_course_id"),
        @Index(name = "idx_status", columnList = "status")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enrollment_id")
    private Long enrollmentId;

    /**
     * Student's user ID from User Service
     * No foreign key due to microservice boundary
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_course_id", nullable = false)
    private BatchCourse batchCourse;

    @Column(name = "enrollment_date", nullable = false)
    @Builder.Default
    private LocalDate enrollmentDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private StudentEnrollmentStatus status = StudentEnrollmentStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
