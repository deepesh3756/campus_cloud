package com.campuscloud.academicservice.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "batch_course_subjects",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_batch_course_subject",
            columnNames = {"batch_course_id", "subject_id"}
        )
    },
    indexes = {
        @Index(name = "idx_batch_course_id", columnList = "batch_course_id"),
        @Index(name = "idx_subject_id", columnList = "subject_id")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchCourseSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "batch_course_subject_id")
    private Long batchCourseSubjectId;

    // =========================
    // Relationships
    // =========================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_course_id", nullable = false)
    private BatchCourse batchCourse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    // =========================
    // Audit
    // =========================

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // =========================
    // Downstream relationship
    // =========================

    @OneToMany(
        mappedBy = "batchCourseSubject",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    private List<FacultyAssignment> facultyAssignments = new ArrayList<>();
}
