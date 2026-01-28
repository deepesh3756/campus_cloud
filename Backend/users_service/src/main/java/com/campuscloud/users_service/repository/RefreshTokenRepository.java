package com.campuscloud.users_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campuscloud.users_service.entity.RefreshToken;
import com.campuscloud.users_service.entity.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> 
{
	Optional<RefreshToken> findByToken(String token);
	
	void deleteByUser(User user);
}