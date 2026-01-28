package com.campuscloud.users_service.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.campuscloud.users_service.entity.Status;
import com.campuscloud.users_service.entity.User;
import com.campuscloud.users_service.repository.UserRepository;
import com.campuscloud.users_service.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public void updateUserStatus(Long userId, Status status) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found with id: " + userId)
                );

        // Optional: no-op if same status
        if (user.getStatus() == status) {
            return;
        }

        user.setStatus(status);
        // No save() needed — JPA dirty checking handles it
    }
}