package com.campuscloud.users_service.service.impl;

import org.springframework.stereotype.Service;
import com.campuscloud.users_service.dto.AdminRegisterRequestDto;
import com.campuscloud.users_service.entity.Admin;
import com.campuscloud.users_service.entity.Gender;
import com.campuscloud.users_service.entity.User;
import com.campuscloud.users_service.repository.AdminRepository;
import com.campuscloud.users_service.service.AdminProfileService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminProfileServiceImpl implements AdminProfileService {

	private final AdminRepository adminRepository;

	@Override
	public void createAdminProfile(User user, AdminRegisterRequestDto dto) 
	{
	    Admin admin = new Admin();
	    admin.setUser(user);
	    admin.setFirstName(dto.getFirstName());
	    admin.setLastName(dto.getLastName());
	    admin.setEmail(dto.getEmail());
	    admin.setMobile(dto.getMobile());
	    admin.setGender(Gender.valueOf(dto.getGender()));
	    admin.setProfilePictureUrl(dto.getProfilePictureUrl());
	
	    adminRepository.save(admin);
	}
	
	public String getFullName(User user) {
        return adminRepository.findByUser(user)
                .map(a -> a.getFirstName() + " " + a.getLastName())
                .orElse(null);
    }
}
