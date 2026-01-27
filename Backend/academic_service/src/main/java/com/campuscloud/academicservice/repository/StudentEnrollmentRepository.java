package com.campuscloud.academicservice.repository;

import com.campuscloud.academicservice.entity.StudentEnrollment;
import com.campuscloud.academicservice.enums.StudentEnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Long> {
    
    Optional<StudentEnrollment> findByUserIdAndBatchCourse_BatchCourseId(
        Long userId, Long batchCourseId
    );
    
    List<StudentEnrollment> findByUserId(Long userId);
    
    List<StudentEnrollment> findByBatchCourse_BatchCourseId(Long batchCourseId);
    
    List<StudentEnrollment> findByBatchCourse_Batch_BatchId(Long batchId);
    
    List<StudentEnrollment> findByStatus(StudentEnrollmentStatus status);
    
    boolean existsByUserIdAndBatchCourse_BatchCourseId(Long userId, Long batchCourseId);
    
    @Query("SELECT se FROM StudentEnrollment se " +
           "JOIN FETCH se.batchCourse bc " +
           "JOIN FETCH bc.batch b " +
           "JOIN FETCH bc.course c " +
           "WHERE se.userId = :userId AND se.status = :status")
    List<StudentEnrollment> findActiveEnrollmentsByUserId(
        @Param("userId") Long userId, 
        @Param("status") StudentEnrollmentStatus status
    );
    
    @Query("SELECT COUNT(se) FROM StudentEnrollment se " +
           "WHERE se.batchCourse.batchCourseId = :batchCourseId " +
           "AND se.status = 'ACTIVE'")
    Long countActiveStudentsByBatchCourse(@Param("batchCourseId") Long batchCourseId);
}