package com.campuscloud.users_service.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campuscloud.users_service.dto.AdminProfileUpdateRequestDto;
import com.campuscloud.users_service.dto.BaseProfileFieldsDto;
import com.campuscloud.users_service.dto.BaseUserProfileResponseDto;
import com.campuscloud.users_service.dto.AdminProfileResponseDto;
import com.campuscloud.users_service.dto.FacultyProfileUpdateRequestDto;
import com.campuscloud.users_service.dto.FacultyProfileResponseDto;
import com.campuscloud.users_service.dto.StudentProfileUpdateRequestDto;
import com.campuscloud.users_service.dto.StudentProfileResponseDto;
import com.campuscloud.users_service.entity.Admin;
import com.campuscloud.users_service.entity.Faculty;
import com.campuscloud.users_service.entity.Gender;
import com.campuscloud.users_service.entity.Student;
import com.campuscloud.users_service.entity.User;
import com.campuscloud.users_service.repository.AdminRepository;
import com.campuscloud.users_service.repository.FacultyRepository;
import com.campuscloud.users_service.repository.StudentRepository;
import com.campuscloud.users_service.repository.UserRepository;
import com.campuscloud.users_service.service.UserProfileService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public BaseUserProfileResponseDto getProfile(Long userId) {
        User user = findUserOrThrow(userId);

        return switch (user.getRole()) {
            case ADMIN -> toResponse(user, adminRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Admin profile not found for userId: " + userId)));
            case FACULTY -> toResponse(user, facultyRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Faculty profile not found for userId: " + userId)));
            case STUDENT -> toResponse(user, studentRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Student profile not found for userId: " + userId)));
        };
    }

    @Override
    public BaseUserProfileResponseDto updateProfile(Long userId, JsonNode request) {
        if (request == null || request.isNull()) {
            throw new RuntimeException("Request body is missing");
        }

        User user = findUserOrThrow(userId);

        JsonNode usernameNode = request.get("username");
        if (usernameNode != null && !usernameNode.isNull()) {
            String newUsername = usernameNode.asText();
            if (newUsername == null || newUsername.isBlank()) {
                throw new RuntimeException("username cannot be blank");
            }

            String trimmed = newUsername.trim();
            if (!trimmed.equals(user.getUsername())) {
                User existing = userRepository.findByUsername(trimmed).orElse(null);
                if (existing != null && !existing.getUserId().equals(user.getUserId())) {
                    throw new RuntimeException("Username already exists");
                }
                user.setUsername(trimmed);
            }
        }

        return switch (user.getRole()) {
            case ADMIN -> {
                Admin admin = adminRepository.findByUser(user)
                        .orElseThrow(() -> new RuntimeException("Admin profile not found for userId: " + userId));
                AdminProfileUpdateRequestDto dto = objectMapper.convertValue(request, AdminProfileUpdateRequestDto.class);
                applyCommonUpdates(admin, dto);
                yield toResponse(user, admin);
            }
            case FACULTY -> {
                Faculty faculty = facultyRepository.findByUser(user)
                        .orElseThrow(() -> new RuntimeException("Faculty profile not found for userId: " + userId));
                FacultyProfileUpdateRequestDto dto = objectMapper.convertValue(request, FacultyProfileUpdateRequestDto.class);
                applyCommonUpdates(faculty, dto);
                yield toResponse(user, faculty);
            }
            case STUDENT -> {
                Student student = studentRepository.findByUser(user)
                        .orElseThrow(() -> new RuntimeException("Student profile not found for userId: " + userId));

                StudentProfileUpdateRequestDto dto = objectMapper.convertValue(request, StudentProfileUpdateRequestDto.class);
                if (dto.getPrn() != null) {
                    student.setPrn(dto.getPrn());
                }

                applyCommonUpdates(student, dto);
                yield toResponse(user, student);
            }
        };
    }

    private User findUserOrThrow(Long userId) {
        if (userId == null) {
            throw new RuntimeException("userId is required");
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    private void applyCommonUpdates(Admin admin, BaseProfileFieldsDto request) {
        admin.setFirstName(request.getFirstName());
        admin.setLastName(request.getLastName());
        admin.setEmail(request.getEmail());
        admin.setMobile(request.getMobile());
        admin.setGender(parseGender(request.getGender()));
        admin.setProfilePictureUrl(request.getProfilePictureUrl());
    }

    private void applyCommonUpdates(Faculty faculty, BaseProfileFieldsDto request) {
        faculty.setFirstName(request.getFirstName());
        faculty.setLastName(request.getLastName());
        faculty.setEmail(request.getEmail());
        faculty.setMobile(request.getMobile());
        faculty.setGender(parseGender(request.getGender()));
        faculty.setProfilePictureUrl(request.getProfilePictureUrl());
    }

    private void applyCommonUpdates(Student student, BaseProfileFieldsDto request) {
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setEmail(request.getEmail());
        student.setMobile(request.getMobile());
        student.setGender(parseGender(request.getGender()));
        student.setProfilePictureUrl(request.getProfilePictureUrl());
    }

    private Gender parseGender(String gender) {
        if (gender == null || gender.isBlank()) {
            throw new RuntimeException("gender is required");
        }
        return Gender.valueOf(gender.trim().toUpperCase());
    }

    private AdminProfileResponseDto toResponse(User user, Admin admin) {
        AdminProfileResponseDto dto = new AdminProfileResponseDto();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole().name());
        dto.setStatus(user.getStatus() == null ? null : user.getStatus().name());
        dto.setFirstName(admin.getFirstName());
        dto.setLastName(admin.getLastName());
        dto.setEmail(admin.getEmail());
        dto.setMobile(admin.getMobile());
        dto.setGender(admin.getGender() == null ? null : admin.getGender().name());
        dto.setProfilePictureUrl(admin.getProfilePictureUrl());
        return dto;
    }

    private FacultyProfileResponseDto toResponse(User user, Faculty faculty) {
        FacultyProfileResponseDto dto = new FacultyProfileResponseDto();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole().name());
        dto.setStatus(user.getStatus() == null ? null : user.getStatus().name());
        dto.setFirstName(faculty.getFirstName());
        dto.setLastName(faculty.getLastName());
        dto.setEmail(faculty.getEmail());
        dto.setMobile(faculty.getMobile());
        dto.setGender(faculty.getGender() == null ? null : faculty.getGender().name());
        dto.setProfilePictureUrl(faculty.getProfilePictureUrl());
        return dto;
    }

    private StudentProfileResponseDto toResponse(User user, Student student) {
        StudentProfileResponseDto dto = new StudentProfileResponseDto();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole().name());
        dto.setStatus(user.getStatus() == null ? null : user.getStatus().name());
        dto.setPrn(student.getPrn());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());
        dto.setMobile(student.getMobile());
        dto.setGender(student.getGender() == null ? null : student.getGender().name());
        dto.setProfilePictureUrl(student.getProfilePictureUrl());
        return dto;
    }
}
