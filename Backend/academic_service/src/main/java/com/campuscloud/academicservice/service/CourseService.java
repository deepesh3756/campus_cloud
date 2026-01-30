package com.campuscloud.academicservice.service;



import com.campuscloud.academicservice.dto.request.CreateCourseRequest;
import com.campuscloud.academicservice.dto.request.UpdateCourseRequest;
import com.campuscloud.academicservice.dto.response.CourseDTO;
import com.campuscloud.academicservice.entity.Course;
import com.campuscloud.academicservice.enums.CourseStatus;
import com.campuscloud.academicservice.exception.DuplicateResourceException;
import com.campuscloud.academicservice.exception.ResourceNotFoundException;
import com.campuscloud.academicservice.repository.CourseRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Transactional
    public CourseDTO createCourse(CreateCourseRequest request) {
        log.info("Creating course: {}", request.getCourseCode());
        
        if (courseRepository.existsByCourseCode(request.getCourseCode())) {
            throw new DuplicateResourceException("Course code already exists: " + request.getCourseCode());
        }
        
        Course course = Course.builder()
                .courseCode(request.getCourseCode())
                .courseName(request.getCourseName())
                .durationMonths(request.getDurationMonths())
                .status(request.getStatus() == null ? CourseStatus.ACTIVE : request.getStatus())
                .build();
        
        Course savedCourse = courseRepository.save(course);
        log.info("Course created successfully: {}", savedCourse.getCourseId());
        
        return CourseDTO.fromEntity(savedCourse);
    }
    
    public CourseDTO getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));
        return CourseDTO.fromEntity(course);
    }
    
    public List<CourseDTO> getAllCourses(CourseStatus status) {
        List<Course> courses;
        
        if (status != null) {
            courses = courseRepository.findByStatus(status);
        } else {
            courses = courseRepository.findAll();
        }
        
        return courses.stream()
                .map(CourseDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CourseDTO updateCourse(Long courseId, UpdateCourseRequest request) {
        log.info("Updating course: {}", courseId);
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));
        
        if (request.getCourseCode() != null) {
            if (!request.getCourseCode().equals(course.getCourseCode()) &&
                courseRepository.existsByCourseCode(request.getCourseCode())) {
                throw new DuplicateResourceException("Course code already exists: " + request.getCourseCode());
            }
            course.setCourseCode(request.getCourseCode());
        }
        
        if (request.getCourseName() != null) {
            course.setCourseName(request.getCourseName());
        }
        
        if (request.getDurationMonths() != null) {
            course.setDurationMonths(request.getDurationMonths());
        }
        
        if (request.getStatus() != null) {
            course.setStatus(request.getStatus());
        }
        
        Course updatedCourse = courseRepository.save(course);
        log.info("Course updated successfully: {}", courseId);
        
        return CourseDTO.fromEntity(updatedCourse);
    }
    
    @Transactional
    public void deleteCourse(Long courseId) {
        log.info("Deleting course: {}", courseId);
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));
        
        courseRepository.delete(course);
        log.info("Course deleted successfully: {}", courseId);
    }
}
