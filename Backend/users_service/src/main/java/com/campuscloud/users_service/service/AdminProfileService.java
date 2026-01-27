package com.campuscloud.users_service.service;

import com.campuscloud.users_service.dto.AdminRegisterRequestDto;
import com.campuscloud.users_service.entity.User;

public interface AdminProfileService 
{
	public void createAdminProfile(User user, AdminRegisterRequestDto dto);
	public String getFullName(User user);
}
