package com.campuscloud.users_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campuscloud.users_service.entity.Admin;
import com.campuscloud.users_service.entity.User;

public interface AdminRepository extends JpaRepository<Admin, Long> 
{	
	Optional<Admin> findByUser(User user);
}
