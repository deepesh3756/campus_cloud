package com.campuscloud.users_service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class StudentRegisterRequestDto extends BaseProfileFieldsDto {

    // User data
    private String username;
    private String password;

    // Student profile data
    private String prn;          // Unique student identifier
}
