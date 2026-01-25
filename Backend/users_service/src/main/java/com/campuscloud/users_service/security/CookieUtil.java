package com.campuscloud.users_service.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CookieUtil {

    @Value("${jwt.refresh.expiration}")
    private long refreshTokenMaxAgeMs;

    public long getRefreshTokenMaxAgeMs() {
        return refreshTokenMaxAgeMs;
    }

    public ResponseCookie createRefreshTokenCookie(String token, long maxAgeMs) {
        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                //.secure(false) // TRUE in production
                .secure(true) // CORS 
                .sameSite("None") // CORS
                .path("/api/users/refresh-token")
                .maxAge(maxAgeMs / 1000)
                .sameSite("Strict")
                .build();
    }

    public ResponseCookie deleteRefreshTokenCookie() {
        return ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .path("/api/users/refresh-token")
                .maxAge(0)
                .build();
    }
}
