package com.campuscloud.users_service.dto;

import lombok.Data;

@Data
public class ChangePasswordRequestDto 
{
    private String username;
    private String currentPassword;
    private String newPassword;
}
