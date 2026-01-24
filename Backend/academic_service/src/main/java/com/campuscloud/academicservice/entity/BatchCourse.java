package com.campuscloud.academicservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Junction table connecting Batch and Course
 * Allows same course to be offered in multiple batches
 */
@Entity
@Table(name = "batch_courses", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"batch_id", "course_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchCourse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "batch_course_id")
    private Long batchCourseId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Relationship: One batch-course can have many subjects
    @OneToMany(mappedBy = "batchCourse", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BatchCourseSubject> batchCourseSubjects = new ArrayList<>();
    
    // Relationship: One batch-course can have many enrolled students
    //orphan removal ensures cleanup when batch-course mappings are removed
    @OneToMany(mappedBy = "batchCourse", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<StudentEnrollment> studentEnrollments = new ArrayList<>();
}