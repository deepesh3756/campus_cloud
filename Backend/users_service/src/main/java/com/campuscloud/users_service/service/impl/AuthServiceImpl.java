package com.campuscloud.users_service.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.campuscloud.users_service.dto.AdminRegisterRequestDto;
import com.campuscloud.users_service.dto.FacultyRegisterRequestDto;
import com.campuscloud.users_service.dto.LoginRequestDTO;
import com.campuscloud.users_service.dto.LoginResponseDTO;
import com.campuscloud.users_service.dto.StudentRegisterRequestDto;
import com.campuscloud.users_service.entity.Admin;
import com.campuscloud.users_service.entity.Gender;
import com.campuscloud.users_service.entity.RefreshToken;
import com.campuscloud.users_service.entity.Role;
import com.campuscloud.users_service.entity.Status;
import com.campuscloud.users_service.entity.User;
import com.campuscloud.users_service.entity.UserPrincipal;
import com.campuscloud.users_service.repository.AdminRepository;
import com.campuscloud.users_service.repository.FacultyRepository;
import com.campuscloud.users_service.repository.UserRepository;
import com.campuscloud.users_service.security.JwtUtil;
import com.campuscloud.users_service.service.AdminProfileService;
import com.campuscloud.users_service.service.AuthLoginResult;
import com.campuscloud.users_service.service.AuthService;
import com.campuscloud.users_service.service.FacultyProfileService;
import com.campuscloud.users_service.service.RefreshTokenService;
import com.campuscloud.users_service.service.StudentProfileService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService 
{
	private final AuthenticationManager authenticationManager;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final RefreshTokenService refreshTokenService;
	
	private final UserRepository userRepository;
	private final AdminProfileService adminProfileService;
	private final FacultyProfileService facultyProfileService;
	private final StudentProfileService studentProfileService;

    public void registerAdmin(AdminRegisterRequestDto dto) 
    {
        // Create Account
        User user = createUser(
    		dto.getUsername(), 
    		dto.getPassword(), 
    		Role.ADMIN
		); 

        // Save Account (account_id generated here)
        User savedUser = userRepository.save(user);
        
        // Create Admin profile
        adminProfileService.createAdminProfile(savedUser, dto);
    }
    
    public void registerFaculty(FacultyRegisterRequestDto dto) {

        // 1️⃣ Create Account (role decided server-side)
        User user = createUser(
            dto.getUsername(),
            dto.getPassword(),
            Role.FACULTY
        );

        // 2️⃣ Save Account (user_id generated here)
        User savedUser = userRepository.save(user);

        // 3️⃣ Create Faculty profile
        facultyProfileService.createFacultyProfile(savedUser, dto);
    }
    
    public void registerStudent(StudentRegisterRequestDto dto) {

        // 1️⃣ Create Account
        User user = createUser(
            dto.getUsername(),
            dto.getPassword(),
            Role.STUDENT
        );

        // 2️⃣ Save Account (user_id generated here)
        User savedUser = userRepository.save(user);

        // 3️⃣ Create Student profile
        studentProfileService.createStudentProfile(savedUser, dto);
    }
    
    @Override
    public AuthLoginResult login(LoginRequestDTO request) {

        Authentication authentication =
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );

        UserPrincipal principal =
            (UserPrincipal) authentication.getPrincipal();
        User user = principal.getUser();

        String accessToken = jwtUtil.generateToken(user);
        RefreshToken refreshToken =
            refreshTokenService.createRefreshToken(user);

        LoginResponseDTO.UserInfo userInfo =
                buildUserInfo(user); // 👈 single source of truth

        return new AuthLoginResult(
            accessToken,
            jwtUtil.getAccessTokenExpirySeconds(),
            refreshToken.getToken(),
            userInfo
        );

    }

    public User createUser(
            String username,
            String rawPassword,
            Role role
    ) {

        // 1️⃣ Check if username already exists
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // 2️⃣ Hash password
        String hashedPassword = passwordEncoder.encode(rawPassword);

        // 3️⃣ Create Account
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(hashedPassword);
        user.setRole(role);
        user.setStatus(Status.ACTIVE);

        // 4️⃣ Save Account
        return userRepository.save(user);
    }
      
    private String resolveFullName(User user) {

        if (user == null || user.getRole() == null) {
            return null;
        }

        return switch (user.getRole()) {

            case ADMIN -> adminProfileService.getFullName(user);
            
            case FACULTY -> facultyProfileService.getFullName(user);
            
            //case STUDENT -> 

            default -> null; // ✅ REQUIRED fallback
        };
    }
    
    public LoginResponseDTO.UserInfo buildUserInfo(User user) {
        String fullName = resolveFullName(user);

        return new LoginResponseDTO.UserInfo(
            user.getUsername(),
            user.getRole().name(),
            fullName
        );
    }
 
}

