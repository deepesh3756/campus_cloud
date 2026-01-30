package com.campuscloud.users_service.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campuscloud.users_service.dto.AdminRegisterRequestDto;
import com.campuscloud.users_service.dto.BulkRegisterEntryDto;
import com.campuscloud.users_service.dto.FacultyRegisterRequestDto;
import com.campuscloud.users_service.dto.StudentRegisterRequestDto;
import com.campuscloud.users_service.dto.UserResponseDto;
import com.campuscloud.users_service.entity.Admin;
import com.campuscloud.users_service.entity.Faculty;
import com.campuscloud.users_service.entity.Student;
import com.campuscloud.users_service.entity.Role;
import com.campuscloud.users_service.entity.Status;
import com.campuscloud.users_service.entity.User;
import com.campuscloud.users_service.repository.AdminRepository;
import com.campuscloud.users_service.repository.FacultyRepository;
import com.campuscloud.users_service.repository.StudentRepository;
import com.campuscloud.users_service.repository.UserRepository;
import com.campuscloud.users_service.service.AdminProfileService;
import com.campuscloud.users_service.service.FacultyProfileService;
import com.campuscloud.users_service.service.StudentProfileService;
import com.campuscloud.users_service.service.UserService;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;
    
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
    public void updateUserStatus(Long userId, Status status) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found with id: " + userId)
                );

        // Optional: no-op if same status
        if (user.getStatus() == status) {
            return;
        }

        user.setStatus(status);
        // No save() needed — JPA dirty checking handles it
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

        return user;
    }
    
    @Override
    public String resolveFullName(User user) {
    	
    	if (user == null || user.getRole() == null) {
            return null;
        }

        return switch (user.getRole()) {
            case ADMIN -> adminProfileService.getFullName(user);
            case FACULTY -> facultyProfileService.getFullName(user);
            case STUDENT -> studentProfileService.getFullName(user);
            default -> throw new IllegalStateException("Unsupported role");
        };
    }


    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllAdmins() {
        return userRepository.findByRole(Role.ADMIN)
                .stream()
                .map(this::toUserResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllFaculties() {
        return userRepository.findByRole(Role.FACULTY)
                .stream()
                .map(this::toUserResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllStudents() {
        return userRepository.findByRole(Role.STUDENT)
                .stream()
                .map(this::toUserResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<UserResponseDto> registerUsersInBulk(List<BulkRegisterEntryDto> request) {
        if (request == null) {
            throw new RuntimeException("Request body is missing");
        }

        return request.stream()
                .map(this::registerOneFromBulk)
                .collect(Collectors.toList());
    }

    private UserResponseDto toUserResponseDto(User user) {
        if (user == null) {
            throw new RuntimeException("user is required");
        }

        String role = user.getRole() == null ? null : user.getRole().name();
        String status = user.getStatus() == null ? null : user.getStatus().name();

        String prn = null;
        String firstName = null;
        String lastName = null;
        String email = null;
        String mobile = null;
        String gender = null;
        String profilePictureUrl = null;

        if (user.getRole() == Role.ADMIN) {
            Admin admin = adminRepository.findByUser(user).orElse(null);
            if (admin != null) {
                firstName = admin.getFirstName();
                lastName = admin.getLastName();
                email = admin.getEmail();
                mobile = admin.getMobile();
                gender = admin.getGender() == null ? null : admin.getGender().name();
                profilePictureUrl = admin.getProfilePictureUrl();
            }
        } else if (user.getRole() == Role.FACULTY) {
            Faculty faculty = facultyRepository.findByUser(user).orElse(null);
            if (faculty != null) {
                firstName = faculty.getFirstName();
                lastName = faculty.getLastName();
                email = faculty.getEmail();
                mobile = faculty.getMobile();
                gender = faculty.getGender() == null ? null : faculty.getGender().name();
                profilePictureUrl = faculty.getProfilePictureUrl();
            }
        } else if (user.getRole() == Role.STUDENT) {
            Student student = studentRepository.findByUser(user).orElse(null);
            if (student != null) {
                prn = student.getPrn();
                firstName = student.getFirstName();
                lastName = student.getLastName();
                email = student.getEmail();
                mobile = student.getMobile();
                gender = student.getGender() == null ? null : student.getGender().name();
                profilePictureUrl = student.getProfilePictureUrl();
            }
        }

        return new UserResponseDto(
                user.getUserId(),
                user.getUsername(),
                role,
                status,
                prn,
                firstName,
                lastName,
                email,
                mobile,
                gender,
                profilePictureUrl
        );
    }

    private UserResponseDto registerOneFromBulk(BulkRegisterEntryDto entry) {
        if (entry == null) {
            throw new RuntimeException("Invalid bulk entry");
        }

        if (entry.getRole() == null || entry.getRole().isBlank()) {
            throw new RuntimeException("role is required for each bulk entry");
        }
        
        if (entry.getData() == null || entry.getData().isNull()) {
            throw new RuntimeException("data is required for each bulk entry");
        }

        String role = entry.getRole().trim().toUpperCase();

        switch (role) {
            case "ADMIN" -> {
                AdminRegisterRequestDto dto = objectMapper.convertValue(entry.getData(), AdminRegisterRequestDto.class);
                registerAdmin(dto);
                return toUserResponseDto(findByUsernameOrThrow(dto.getUsername()));
            }
            case "FACULTY" -> {
                FacultyRegisterRequestDto dto = objectMapper.convertValue(entry.getData(), FacultyRegisterRequestDto.class);
                registerFaculty(dto);
                return toUserResponseDto(findByUsernameOrThrow(dto.getUsername()));
            }
            case "STUDENT" -> {
                StudentRegisterRequestDto dto = objectMapper.convertValue(entry.getData(), StudentRegisterRequestDto.class);
                registerStudent(dto);
                return toUserResponseDto(findByUsernameOrThrow(dto.getUsername()));
            }
            default -> throw new RuntimeException("Unsupported role in bulk registration: " + entry.getRole());
        }
    }

    private User findByUsernameOrThrow(String username) {
        if (username == null || username.isBlank()) {
            throw new RuntimeException("username is required");
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found after registration: " + username));
    }

    @Override
    public void changePassword(String username, String currentPassword, String newPassword) {
        if (username == null || username.isBlank()) {
            throw new RuntimeException("username is required");
        }
        if (currentPassword == null || currentPassword.isBlank()) {
            throw new RuntimeException("currentPassword is required");
        }
        if (newPassword == null || newPassword.isBlank()) {
            throw new RuntimeException("newPassword is required");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
    }
}