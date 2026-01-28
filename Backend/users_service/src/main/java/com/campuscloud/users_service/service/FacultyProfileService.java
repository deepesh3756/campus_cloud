package com.campuscloud.users_service.service;

import com.campuscloud.users_service.dto.FacultyRegisterRequestDto;
import com.campuscloud.users_service.entity.User;

public interface FacultyProfileService {

    void createFacultyProfile(User user, FacultyRegisterRequestDto dto);

    String getFullName(User user);
}
