package com.campuscloud.users_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDto {

    private Long userId;
    private String username;
    private String role;
    private String status;

    // student-only
    private String prn;

    // shared profile fields
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String gender;
    private String profilePictureUrl;
}
