package com.campuscloud.users_service.service;

import com.campuscloud.users_service.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthLoginResult {

    private final User user;
    private final String accessToken;
    private final String refreshToken;
    private final long expiresIn; // seconds
}
