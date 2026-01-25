package com.campuscloud.academicservice.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.campuscloud.academicservice.enums.FacultyStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * FACULTY ASSIGNMENTS
 *
 * Maps exactly to table:
 * faculty_assignments
 *
 * user_id → comes from User Service (no FK)
 * batch_course_subject_id → FK to academic_db.batch_course_subjects
 */
@Entity
@Table(
    name = "faculty_assignments",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_faculty_bcs",
            columnNames = {"user_id", "batch_course_subject_id"}
        )
    },
    indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(
            name = "idx_batch_course_subject_id",
            columnList = "batch_course_subject_id"
        )
    }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacultyAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Long assignmentId;

    /**
     * Faculty user id from users_db
     * (no foreign key — microservice boundary)
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * FK → batch_course_subjects.batch_course_subject_id
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "batch_course_subject_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_fa_batch_course_subject")
    )
    private BatchCourseSubject batchCourseSubject;

    /**
     * DEFAULT CURRENT_DATE
     */
    @Column(name = "assigned_date", nullable = false)
    @Builder.Default
    private LocalDate assignedDate = LocalDate.now();

    /**
     * ENUM('ACTIVE','INACTIVE')
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private FacultyStatus status = FacultyStatus.ACTIVE;

    /**
     * DEFAULT CURRENT_TIMESTAMP
     */
    @CreationTimestamp
    @Column(
        name = "created_at",
        nullable = false,
        updatable = false
    )
    private LocalDateTime createdAt;
}

