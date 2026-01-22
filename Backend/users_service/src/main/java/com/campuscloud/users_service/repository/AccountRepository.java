package com.campuscloud.users_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campuscloud.users_service.entity.Account;

public interface AccountRepository extends JpaRepository<Account, Long> 
{
	Optional<Account> findByUsername(String username);
}
