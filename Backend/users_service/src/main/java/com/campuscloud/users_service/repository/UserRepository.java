package com.campuscloud.users_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campuscloud.users_service.entity.Role;
import com.campuscloud.users_service.entity.User;

public interface UserRepository extends JpaRepository<User, Long> 
{
	Optional<User> findByUsername(String username);

	List<User> findByRole(Role role);
}
