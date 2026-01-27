package com.campuscloud.users_service.dto;

import lombok.Data;

@Data
public class FacultyRegisterRequestDto {

    // User data
    private String username;
    private String password;

    // Faculty profile data
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String gender;
    private String profilePictureUrl;
}
