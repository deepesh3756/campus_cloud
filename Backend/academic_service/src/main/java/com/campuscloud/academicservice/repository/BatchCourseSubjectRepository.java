package com.campuscloud.academicservice.repository;

import com.campuscloud.academicservice.entity.BatchCourseSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BatchCourseSubjectRepository extends JpaRepository<BatchCourseSubject, Long> {
    
    List<BatchCourseSubject> findByBatchCourse_BatchCourseId(Long batchCourseId);
    
    boolean existsByBatchCourse_BatchCourseId(Long batchCourseId);
    
    Optional<BatchCourseSubject> findByBatchCourse_BatchCourseIdAndSubject_SubjectId(
        Long batchCourseId, Long subjectId
    );
    
    boolean existsByBatchCourse_BatchCourseIdAndSubject_SubjectId(
        Long batchCourseId, Long subjectId
    );
    
    @Query("SELECT bcs FROM BatchCourseSubject bcs " +
           "JOIN FETCH bcs.batchCourse bc " +
           "JOIN FETCH bc.batch b " +
           "JOIN FETCH bc.course c " +
           "JOIN FETCH bcs.subject s " +
           "WHERE b.batchId = :batchId AND c.courseId = :courseId")
    List<BatchCourseSubject> findSubjectsByBatchAndCourse(
        @Param("batchId") Long batchId, 
        @Param("courseId") Long courseId
    );

    @Query("SELECT bcs FROM BatchCourseSubject bcs " +
           "JOIN FETCH bcs.batchCourse bc " +
           "JOIN FETCH bc.batch b " +
           "JOIN FETCH bc.course c " +
           "JOIN FETCH bcs.subject s " +
           "WHERE bcs.batchCourseSubjectId = :batchCourseSubjectId")
    Optional<BatchCourseSubject> findWithDetailsById(
        @Param("batchCourseSubjectId") Long batchCourseSubjectId
    );
}