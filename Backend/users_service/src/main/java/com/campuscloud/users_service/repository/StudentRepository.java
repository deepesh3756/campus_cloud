package com.campuscloud.users_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campuscloud.users_service.entity.Faculty;
import com.campuscloud.users_service.entity.Student;
import com.campuscloud.users_service.entity.User;

public interface StudentRepository extends JpaRepository<Student, Long> 
{
	Optional<Faculty> findByUser(User user);
}
