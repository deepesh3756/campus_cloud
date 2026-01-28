package com.campuscloud.users_service.service;

import java.util.Optional;

import com.campuscloud.users_service.entity.RefreshToken;
import com.campuscloud.users_service.entity.User;

public interface RefreshTokenService 
{
    RefreshToken createRefreshToken(User user);

    RefreshToken verifyExpiration(RefreshToken token);

    Optional<RefreshToken> findByToken(String token);

    void delete(RefreshToken token);

    void deleteByUser(User user);
}
