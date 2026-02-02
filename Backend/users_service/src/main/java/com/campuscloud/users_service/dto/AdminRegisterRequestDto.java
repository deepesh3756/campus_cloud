package com.campuscloud.users_service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class AdminRegisterRequestDto extends BaseProfileFieldsDto {

    // User data
    private String username;
    private String password;
}
