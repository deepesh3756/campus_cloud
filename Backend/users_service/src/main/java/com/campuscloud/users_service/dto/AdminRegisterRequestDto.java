package com.campuscloud.users_service.dto;

import lombok.Data;

@Data
public class AdminRegisterRequestDto {

    // Account data
    private String username;
    private String password;

    // Admin profile data
    private String name;
    private String email;
    private String phone;
    private String gender; // MALE | FEMALE | OTHER
}
