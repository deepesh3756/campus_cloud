package com.campuscloud.users_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campuscloud.users_service.dto.ApiResponse;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @GetMapping("/data")
    public ResponseEntity<ApiResponse<String>> adminOnly() {
        return ResponseEntity.ok(ApiResponse.success("Admin access"));
    }
}
