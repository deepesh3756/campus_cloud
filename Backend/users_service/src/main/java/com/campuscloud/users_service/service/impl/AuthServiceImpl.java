package com.campuscloud.users_service.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.campuscloud.users_service.dto.AdminRegisterRequestDto;
import com.campuscloud.users_service.dto.LoginRequestDTO;
import com.campuscloud.users_service.dto.LoginResponseDTO;
import com.campuscloud.users_service.entity.Admin;
import com.campuscloud.users_service.entity.Gender;
import com.campuscloud.users_service.entity.Role;
import com.campuscloud.users_service.entity.Status;
import com.campuscloud.users_service.entity.User;
import com.campuscloud.users_service.entity.UserPrincipal;
import com.campuscloud.users_service.repository.AdminRepository;
import com.campuscloud.users_service.repository.UserRepository;
import com.campuscloud.users_service.service.AuthService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService 
{
	private final AuthenticationManager authenticationManager;
	private final UserRepository userRepository;
	private final AdminRepository adminRepository;
	private final PasswordEncoder passwordEncoder;

	/*
    @Transactional
    public LoginResponseDTO login(LoginRequestDTO request) {
    	
    	User user = userRepository.findByUsername(request.getUsername())
    	        .orElseThrow(() -> new RuntimeException("Invalid username or password"));
    	
    	if (user.getStatus()!=Status.ACTIVE) {
            throw new RuntimeException("Account is disabled");
        }

	    boolean matches = passwordEncoder.matches(
	        request.getPassword(),
	        user.getPasswordHash()
	    );

	    if (!matches) {
	        throw new RuntimeException("Invalid username or password");
	    }

        return new LoginResponseDTO(
        		user.getUsername(),
        		user.getRole().name()
        );
    }
    */
    
    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        Authentication authentication =
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = principal.getUser();

        return new LoginResponseDTO(
            user.getUsername(),
            user.getRole().name()
        );
    }
    
    @Transactional
    public void registerAdmin(AdminRegisterRequestDto dto) {

        // 1️⃣ Check if username already exists
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        String hashedPassword = passwordEncoder.encode(dto.getPassword());

        // 2️⃣ Create Account
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPasswordHash(hashedPassword); 
        user.setRole(Role.ADMIN);
        user.setStatus(Status.ACTIVE);

        // 3️⃣ Save Account (account_id generated here)
        User savedUser = userRepository.save(user);

        // 4️⃣ Create Admin profile
        Admin admin = new Admin();
        admin.setUser(savedUser);
        admin.setFirstName(dto.getFirstName());
        admin.setLastName(dto.getLastName());
        admin.setEmail(dto.getEmail());
        admin.setMobile(dto.getMobile());
        admin.setGender(Gender.valueOf(dto.getGender()));

        // 5️⃣ Save Admin
        adminRepository.save(admin);
    }
}

