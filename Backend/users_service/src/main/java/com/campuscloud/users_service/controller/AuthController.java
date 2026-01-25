package com.campuscloud.users_service.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.campuscloud.users_service.dto.AdminRegisterRequestDto;
import com.campuscloud.users_service.dto.LoginRequestDTO;
import com.campuscloud.users_service.dto.LoginResponseDTO;
import com.campuscloud.users_service.entity.RefreshToken;
import com.campuscloud.users_service.entity.User;
import com.campuscloud.users_service.security.CookieUtil;
import com.campuscloud.users_service.security.JwtUtil;
import com.campuscloud.users_service.service.AuthLoginResult;
import com.campuscloud.users_service.service.AuthService;
import com.campuscloud.users_service.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class AuthController 
{
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;
    
    @PostMapping("/register/admin")
    public ResponseEntity<String> registerAdmin(
    		@RequestBody AdminRegisterRequestDto request) 
    {
    	authService.registerAdmin(request);
    	return ResponseEntity
    			.status(HttpStatus.CREATED)
    			.body("Admin registered successfully");
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login2(
            @RequestBody LoginRequestDTO request
    ) {
        // 1️⃣ Authenticate (internal result)
        AuthLoginResult result = authService.login(request);

        // 2️⃣ Create HTTP-only refresh token cookie
        ResponseCookie refreshCookie =
            cookieUtil.createRefreshTokenCookie(
                result.getRefreshToken(),
                cookieUtil.getRefreshTokenMaxAgeMs()
            );

        // 3️⃣ Build final API response
        LoginResponseDTO response = new LoginResponseDTO(
            result.getAccessToken(),
            result.getExpiresIn(),
            "Bearer",
            new LoginResponseDTO.UserInfo(
                result.getUser().getUsername(),
                result.getUser().getRole().name()
            )
        );

        // 4️⃣ Return response + cookie
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponseDTO> refreshToken(
            @CookieValue(name = "refreshToken", required = false)
            String refreshTokenValue
    ) {
        if (refreshTokenValue == null) {
            throw new RuntimeException("Refresh token missing");
        }

        // 1️⃣ Find refresh token in DB
        RefreshToken oldRefreshToken =
            refreshTokenService.findByToken(refreshTokenValue)
                .map(refreshTokenService::verifyExpiration)
                .orElseThrow(() ->
                    new RuntimeException("Invalid refresh token")
                );

        User user = oldRefreshToken.getUser();

        // 2️⃣ Rotate refresh token
        refreshTokenService.delete(oldRefreshToken);
        RefreshToken newRefreshToken =
            refreshTokenService.createRefreshToken(user);

        // 3️⃣ Generate new access token
        String newAccessToken = jwtUtil.generateToken(user);

        // 4️⃣ Create new refresh cookie
        ResponseCookie newCookie =
            cookieUtil.createRefreshTokenCookie(
                newRefreshToken.getToken(),
                cookieUtil.getRefreshTokenMaxAgeMs()
            );

        // 5️⃣ Build response DTO (SAME shape as login)
        LoginResponseDTO response = new LoginResponseDTO(
            newAccessToken,
            jwtUtil.getAccessTokenExpirySeconds(),
            "Bearer",
            new LoginResponseDTO.UserInfo(
                user.getUsername(),
                user.getRole().name()
            )
        );

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, newCookie.toString())
            .body(response);
    }

}
