package com.campuscloud.assignment_service.client;

import com.campuscloud.assignment_service.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

@FeignClient(
        name = "users-service",
        configuration = com.campuscloud.assignment_service.config.FeignClientConfig.class
)
public interface UserServiceClient {

    @GetMapping("/api/users/{userId}")
    ApiResponse<Map<String, Object>> getUserById(@PathVariable Long userId);

    @PostMapping("/api/users/by-ids")
    ApiResponse<List<Map<String, Object>>> getBulkUserDetails(@RequestBody List<Long> userIds);
}
