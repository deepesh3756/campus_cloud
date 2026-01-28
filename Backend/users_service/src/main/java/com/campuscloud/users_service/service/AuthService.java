package com.campuscloud.users_service.service;

import com.campuscloud.users_service.dto.AdminRegisterRequestDto;
import com.campuscloud.users_service.dto.FacultyRegisterRequestDto;
import com.campuscloud.users_service.dto.LoginRequestDTO;
import com.campuscloud.users_service.dto.LoginResponseDTO;
import com.campuscloud.users_service.dto.StudentRegisterRequestDto;
import com.campuscloud.users_service.entity.User;

public interface AuthService 
{
	public void registerAdmin(AdminRegisterRequestDto dto);
	
	public void registerFaculty(FacultyRegisterRequestDto dto);
	
	public void registerStudent(StudentRegisterRequestDto dto);
	
	AuthLoginResult login(LoginRequestDTO request);
	
	public LoginResponseDTO.UserInfo buildUserInfo(User user);
	
}
