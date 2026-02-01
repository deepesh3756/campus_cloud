package com.campuscloud.users_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO 
{
    private String accessToken;
    private long expiresIn;
    private String tokenType;
    private UserInfo user;

    @Data
    @AllArgsConstructor
    public static class UserInfo 
    {
        private Long userId;
        private String username;
        private String role;
        private String fullName;
    }
}
