package com.campuscloud.users_service.dto;

import lombok.Data;

@Data
public class BulkUserRegisterRequestDto {

    private String username;
    private String password;
    private String role;
}
