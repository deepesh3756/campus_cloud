package com.campuscloud.users_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponseDto {

    private String username;
    private String role;

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
