package com.campuscloud.users_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.campuscloud.users_service.dto.AdminRegisterRequestDto;
import com.campuscloud.users_service.dto.ApiResponse;
import com.campuscloud.users_service.dto.BulkRegisterEntryDto;
import com.campuscloud.users_service.dto.ChangePasswordRequestDto;
import com.campuscloud.users_service.dto.ChangePasswordResponseDto;
import com.campuscloud.users_service.dto.FacultyRegisterRequestDto;
import com.campuscloud.users_service.dto.StudentRegisterRequestDto;
import com.campuscloud.users_service.dto.UpdateUserStatusRequestDto;
import com.campuscloud.users_service.dto.BaseUserProfileResponseDto;
import com.campuscloud.users_service.dto.UserResponseDto;
import com.campuscloud.users_service.entity.Role;
import com.campuscloud.users_service.entity.User;
import com.campuscloud.users_service.repository.UserRepository;
import com.campuscloud.users_service.service.UserService;
import com.campuscloud.users_service.service.UserProfileService;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserProfileService userProfileService;
    private final UserRepository userRepository;
    
//    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register/admin")
    public ResponseEntity<ApiResponse<Void>> registerAdmin(
    		@RequestBody AdminRegisterRequestDto request) 
    {
     	userService.registerAdmin(request);
     	return ResponseEntity
     			.status(HttpStatus.CREATED)
    			.body(ApiResponse.success("Admin registered successfully", null));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register/faculty")
    public ResponseEntity<ApiResponse<Void>> registerFaculty(
            @RequestBody FacultyRegisterRequestDto request
    ) {
     	userService.registerFaculty(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Faculty registered successfully", null));
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register/student")
    public ResponseEntity<ApiResponse<Void>> registerStudent(
            @RequestBody StudentRegisterRequestDto request
    ) {
     	userService.registerStudent(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student registered successfully", null));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admins")
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getAllAdmins() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllAdmins()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/faculties")
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getAllFaculties() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllFaculties()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllStudents()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/bulk-details")
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> registerUsersInBulk(
            @RequestBody List<BulkRegisterEntryDto> request
    ) {
        return ResponseEntity.ok(ApiResponse.success(userService.registerUsersInBulk(request)));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<ChangePasswordResponseDto>> changePassword(
            @RequestBody ChangePasswordRequestDto request
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new SecurityException("Authentication is required");
        }
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new RuntimeException("username is required");
        }

        if (!auth.getName().equals(request.getUsername())) {
            throw new SecurityException("You can only change your own password");
        }

        userService.changePassword(request.getUsername(), request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success(new ChangePasswordResponseDto(true, "Password changed successfully")));
    }

    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<BaseUserProfileResponseDto>> getUserProfile(@PathVariable Long userId) {
        enforceProfileAccessRules(userId);
        return ResponseEntity.ok(ApiResponse.success(userProfileService.getProfile(userId)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    @PutMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<BaseUserProfileResponseDto>> updateUserProfile(
            @PathVariable Long userId,
            @RequestBody JsonNode request
    ) {
        enforceProfileAccessRules(userId);
        return ResponseEntity.ok(ApiResponse.success(userProfileService.updateProfile(userId, request)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<BaseUserProfileResponseDto>> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new SecurityException("Authentication is required");
        }

        Long userId = userRepository.findByUsername(auth.getName())
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found for username: " + auth.getName()));

        return ResponseEntity.ok(ApiResponse.success(userProfileService.getProfile(userId)));
    }

    private void enforceProfileAccessRules(Long requestedUserId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new SecurityException("Authentication is required");
        }

        boolean isAdmin = auth.getAuthorities() != null && auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));

        Long callerUserId = userRepository.findByUsername(auth.getName())
                .map(u -> u.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found for username: " + auth.getName()));

        if (!isAdmin) {
            if (requestedUserId == null || !requestedUserId.equals(callerUserId)) {
                throw new SecurityException("You can only access your own profile");
            }
            return;
        }

        if (requestedUserId == null) {
            throw new RuntimeException("userId is required");
        }
        if (requestedUserId.equals(callerUserId)) {
            return;
        }

        User target = userRepository.findById(requestedUserId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + requestedUserId));
        if (target.getRole() == Role.ADMIN) {
            throw new SecurityException("Admin can update only own profile");
        }
    }

    // ✅ PATCH /api/users/{userId}/status
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{userId}/status")
    public ResponseEntity<ApiResponse<Void>> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody UpdateUserStatusRequestDto request
    ) {
        userService.updateUserStatus(userId, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Status updated", null));
    }
}
