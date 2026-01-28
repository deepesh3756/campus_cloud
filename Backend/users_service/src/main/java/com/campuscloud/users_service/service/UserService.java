package com.campuscloud.users_service.service;

import com.campuscloud.users_service.entity.Status;

public interface UserService {

    void updateUserStatus(Long userId, Status status);
}
