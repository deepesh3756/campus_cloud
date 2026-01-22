package com.campuscloud.users_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.campuscloud.users_service.dto.AdminRegisterRequestDto;
import com.campuscloud.users_service.dto.LoginRequestDTO;
import com.campuscloud.users_service.dto.LoginResponseDTO;
import com.campuscloud.users_service.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) 
    {
        LoginResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register/admin")
    public ResponseEntity<String> registerAdmin(
            @RequestBody AdminRegisterRequestDto request) {

        authService.registerAdmin(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Student registered successfully");
    }
}
