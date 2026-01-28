package com.campuscloud.users_service.security;

import java.util.UUID;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CsrfTokenUtil {

    public static final String CSRF_COOKIE_NAME = "XSRF-TOKEN";
    public static final String CSRF_HEADER_NAME = "X-XSRF-TOKEN";

    public String generateToken() {
        return UUID.randomUUID().toString();
    }

    public ResponseCookie createCsrfCookie(String token) {
        return ResponseCookie.from(CSRF_COOKIE_NAME, token)
                .httpOnly(false)     // ⚠ MUST be readable by JS
                .secure(false)       // true in prod (HTTPS)
                .sameSite("Lax")
                .path("/")
                .build();
    }
}
