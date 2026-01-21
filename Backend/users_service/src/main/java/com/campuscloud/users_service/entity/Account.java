package com.campuscloud.users_service.entity;

import org.springframework.context.annotation.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
	@Table(name = "accounts")
	@Getter @Setter
	public class Account {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long accountId;

	    @Column(unique = true, nullable = false)
	    private String username;

	    @Column(nullable = false)
	    private String passwordHash;

	    @Enumerated(EnumType.STRING)
	    private Role role;

	    private boolean isActive = true;
	}

	

