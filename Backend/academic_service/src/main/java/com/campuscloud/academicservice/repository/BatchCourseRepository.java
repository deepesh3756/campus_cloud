package com.campuscloud.academicservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campuscloud.academicservice.entity.BatchCourse;


@Repository
public interface BatchCourseRepository extends JpaRepository<BatchCourse, Long> {

	Optional<BatchCourse> findByBatch_BatchIdAndCourse_CourseId(Long batchId, Long courseId);

	List<BatchCourse> findByBatch_BatchId(Long batchId);

	List<BatchCourse> findByCourse_CourseId(Long courseId);

	boolean existsByBatch_BatchIdAndCourse_CourseId(Long batchId, Long courseId);
}
