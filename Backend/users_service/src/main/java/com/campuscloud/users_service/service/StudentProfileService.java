package com.campuscloud.users_service.service;

import com.campuscloud.users_service.dto.StudentRegisterRequestDto;
import com.campuscloud.users_service.entity.User;

public interface StudentProfileService {

    void createStudentProfile(User user, StudentRegisterRequestDto dto);

    String getFullName(User user);
}
