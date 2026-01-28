package com.campuscloud.users_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.campuscloud.users_service.dto.UpdateUserStatusRequestDto;
import com.campuscloud.users_service.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ✅ PATCH /api/users/{userId}/status
    @PatchMapping("/{userId}/status")
    public ResponseEntity<Void> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody UpdateUserStatusRequestDto request
    ) {
        userService.updateUserStatus(userId, request.getStatus());
        return ResponseEntity.noContent().build();
    }
}
