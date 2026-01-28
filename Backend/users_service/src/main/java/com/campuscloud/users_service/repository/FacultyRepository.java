package com.campuscloud.users_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campuscloud.users_service.entity.Faculty;
import com.campuscloud.users_service.entity.User;

public interface FacultyRepository extends JpaRepository<Faculty, Long> 
{
	    Optional<Faculty> findByUser(User user);

	    boolean existsByUser(User user);
	    
	    //Optional<Faculty> findByEmail(String email);

	    //boolean existsByEmail(String email);
}
