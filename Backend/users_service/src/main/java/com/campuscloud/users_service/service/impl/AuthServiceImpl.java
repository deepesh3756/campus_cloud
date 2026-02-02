package com.campuscloud.users_service.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.campuscloud.users_service.dto.AdminRegisterRequestDto;
import com.campuscloud.users_service.dto.FacultyRegisterRequestDto;
import com.campuscloud.users_service.dto.LoginRequestDTO;
import com.campuscloud.users_service.dto.LoginResponseDTO;
import com.campuscloud.users_service.dto.StudentRegisterRequestDto;
import com.campuscloud.users_service.entity.Admin;
import com.campuscloud.users_service.entity.Gender;
import com.campuscloud.users_service.entity.RefreshToken;
import com.campuscloud.users_service.entity.Role;
import com.campuscloud.users_service.entity.Status;
import com.campuscloud.users_service.entity.User;
import com.campuscloud.users_service.entity.UserPrincipal;
import com.campuscloud.users_service.repository.AdminRepository;
import com.campuscloud.users_service.repository.FacultyRepository;
import com.campuscloud.users_service.repository.UserRepository;
import com.campuscloud.users_service.security.JwtUtil;
import com.campuscloud.users_service.service.AdminProfileService;
import com.campuscloud.users_service.service.AuthLoginResult;
import com.campuscloud.users_service.service.AuthService;
import com.campuscloud.users_service.service.FacultyProfileService;
import com.campuscloud.users_service.service.RefreshTokenService;
import com.campuscloud.users_service.service.StudentProfileService;
import com.campuscloud.users_service.service.UserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService 
{
	private final AuthenticationManager authenticationManager;
	private final JwtUtil jwtUtil;
	private final RefreshTokenService refreshTokenService;
	
	private final UserService userService;


    @Override
    public AuthLoginResult login(LoginRequestDTO request) {

        Authentication authentication =
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );

        UserPrincipal principal =
            (UserPrincipal) authentication.getPrincipal();
        User user = principal.getUser();

        String accessToken = jwtUtil.generateToken(user);
        RefreshToken refreshToken =
            refreshTokenService.createRefreshToken(user);

        LoginResponseDTO.UserInfo userInfo =
                buildUserInfo(user); // 👈 single source of truth

        return new AuthLoginResult(
            accessToken,
            jwtUtil.getAccessTokenExpirySeconds(),
            refreshToken.getToken(),
            userInfo
        );

    }

    public LoginResponseDTO.UserInfo buildUserInfo(User user) {
        String fullName = userService.resolveFullName(user);

        return new LoginResponseDTO.UserInfo(
			user.getUserId(),
            user.getUsername(),
            user.getRole().name(),
            fullName
        );
    }
 
}

