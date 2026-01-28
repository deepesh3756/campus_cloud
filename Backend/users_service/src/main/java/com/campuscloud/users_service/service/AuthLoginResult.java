package com.campuscloud.users_service.service;

import com.campuscloud.users_service.dto.LoginResponseDTO;
import com.campuscloud.users_service.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthLoginResult {
    private String accessToken;
    private long expiresIn;
    private String refreshToken;
    private LoginResponseDTO.UserInfo userInfo;
}
