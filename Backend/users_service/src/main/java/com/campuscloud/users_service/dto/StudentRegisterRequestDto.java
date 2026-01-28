package com.campuscloud.users_service.dto;

import lombok.Data;

@Data
public class StudentRegisterRequestDto {

    // User data
    private String username;
    private String password;

    // Student profile data
    private String prn;          // Unique student identifier
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String gender;       // MALE | FEMALE | OTHER
    private String profilePictureUrl;
}
