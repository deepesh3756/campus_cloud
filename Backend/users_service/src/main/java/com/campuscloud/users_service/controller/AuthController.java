package com.campuscloud.users_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.campuscloud.users_service.dto.AdminRegisterRequestDto;
import com.campuscloud.users_service.dto.LoginRequestDTO;
import com.campuscloud.users_service.dto.LoginResponseDTO;
import com.campuscloud.users_service.dto.RefreshTokenRequestDTO;
import com.campuscloud.users_service.dto.RefreshTokenResponseDTO;
import com.campuscloud.users_service.entity.RefreshToken;
import com.campuscloud.users_service.entity.User;
import com.campuscloud.users_service.entity.UserPrincipal;
import com.campuscloud.users_service.security.JwtUtil;
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
    
    @PostMapping("/register/admin")
    public ResponseEntity<String> registerAdmin(@RequestBody AdminRegisterRequestDto request) 
    {
    	authService.registerAdmin(request);
    	return ResponseEntity
    			.status(HttpStatus.CREATED)
    			.body("Admin registered successfully");
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) 
    {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(Authentication authentication) 
    {
        UserPrincipal principal =
            (UserPrincipal) authentication.getPrincipal();

        refreshTokenService.deleteByUser(principal.getUser());

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponseDTO> refreshToken(@RequestBody RefreshTokenRequestDTO request
    ) {
        // Find refresh token in DB
        RefreshToken oldRefreshToken =
            refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .orElseThrow(() ->
                    new RuntimeException("Invalid refresh token")
                );

        User user = oldRefreshToken.getUser();

        // DELETE old refresh token (rotation)
        refreshTokenService.delete(oldRefreshToken);

        // Create NEW refresh token
        RefreshToken newRefreshToken =
            refreshTokenService.createRefreshToken(user);

        // Create new access token
        String newAccessToken = jwtUtil.generateToken(user);

        // Return BOTH new tokens
        return ResponseEntity.ok(
            new LoginResponseDTO(
                user.getUsername(),
                user.getRole().name(),
                newAccessToken,
                newRefreshToken.getToken()
            )
        );
    }

}
