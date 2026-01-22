package com.campuscloud.users_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campuscloud.users_service.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

}
