package com.campuscloud.academicservice.repository;

import com.campuscloud.academicservice.entity.FacultyAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyAssignmentRepository extends JpaRepository<FacultyAssignment, Long> {
    
    List<FacultyAssignment> findByUserId(Long userId);
    
    List<FacultyAssignment> findByBatchCourseSubject_BatchCourseSubjectId(
        Long batchCourseSubjectId
    );
    
    Optional<FacultyAssignment> findByUserIdAndBatchCourseSubject_BatchCourseSubjectId(
        Long userId, Long batchCourseSubjectId
    );
    
    boolean existsByUserIdAndBatchCourseSubject_BatchCourseSubjectId(
        Long userId, Long batchCourseSubjectId
    );
    
    @Query("SELECT fa FROM FacultyAssignment fa " +
           "JOIN FETCH fa.batchCourseSubject bcs " +
           "JOIN FETCH bcs.batchCourse bc " +
           "JOIN FETCH bc.batch b " +
           "JOIN FETCH bc.course c " +
           "JOIN FETCH bcs.subject s " +
           "WHERE fa.userId = :facultyUserId AND fa.status = 'ACTIVE'")
    List<FacultyAssignment> findActiveFacultyAssignments(@Param("facultyUserId") Long facultyUserId);
}