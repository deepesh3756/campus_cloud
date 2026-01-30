package com.campuscloud.users_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChangePasswordResponseDto {

    private boolean success;
    private String message;
}
