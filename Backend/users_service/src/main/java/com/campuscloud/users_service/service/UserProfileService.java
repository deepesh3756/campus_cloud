package com.campuscloud.users_service.service;

import com.campuscloud.users_service.dto.BaseUserProfileResponseDto;
import com.fasterxml.jackson.databind.JsonNode;

public interface UserProfileService {

    BaseUserProfileResponseDto getProfile(Long userId);

    BaseUserProfileResponseDto updateProfile(Long userId, JsonNode request);
}
