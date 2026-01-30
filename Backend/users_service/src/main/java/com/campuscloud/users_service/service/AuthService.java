package com.campuscloud.users_service.service;

import com.campuscloud.users_service.dto.LoginRequestDTO;
import com.campuscloud.users_service.dto.LoginResponseDTO;

import com.campuscloud.users_service.entity.User;

public interface AuthService 
{
	AuthLoginResult login(LoginRequestDTO request);
	
	public LoginResponseDTO.UserInfo buildUserInfo(User user);
	
}
