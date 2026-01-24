package com.campuscloud.users_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class RefreshTokenResponseDTO {
    private String accessToken;
}
