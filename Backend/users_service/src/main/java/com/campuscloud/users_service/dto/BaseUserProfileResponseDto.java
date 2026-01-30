package com.campuscloud.users_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class BaseUserProfileResponseDto extends BaseProfileFieldsDto {

    private Long userId;
    private String username;
    private String role;

    private String status;
}
