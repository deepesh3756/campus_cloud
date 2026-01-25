package com.campuscloud.academicservice.repository;

import com.campuscloud.academicservice.entity.Course;
import com.campuscloud.academicservice.enums.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Optional<Course> findByCourseCode(String courseCode);
    
    boolean existsByCourseCode(String courseCode);
    
    List<Course> findByStatus(CourseStatus status);
}
