package com.campuscloud.assignment_service.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignClientConfig {

    private static final String HEADER_USER_ID = "X-User-Id";
    private static final String HEADER_USER_ID_ALT = "X-UserId";
    private static final String HEADER_USERNAME = "X-Username";
    private static final String HEADER_USERNAME_ALT = "X-User-Name";
    private static final String HEADER_ROLES = "X-Roles";
    private static final String HEADER_ROLE = "X-Role";

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            ServletRequestAttributes attributes = 
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            
            if (attributes != null) {
                var request = attributes.getRequest();

                String authHeader = request.getHeader("Authorization");
                if (authHeader != null && !authHeader.trim().isEmpty()) {
                    requestTemplate.header("Authorization", authHeader);
                }

                String userId = firstNonBlank(request.getHeader(HEADER_USER_ID), request.getHeader(HEADER_USER_ID_ALT));
                if (userId != null) {
                    requestTemplate.header(HEADER_USER_ID, userId);
                }

                String username = firstNonBlank(request.getHeader(HEADER_USERNAME), request.getHeader(HEADER_USERNAME_ALT));
                if (username != null) {
                    requestTemplate.header(HEADER_USERNAME, username);
                }

                String roles = firstNonBlank(request.getHeader(HEADER_ROLES), request.getHeader(HEADER_ROLE));
                if (roles != null) {
                    requestTemplate.header(HEADER_ROLES, roles);
                }
            }
        };
    }

    private static String firstNonBlank(String a, String b) {
        if (a != null && !a.trim().isEmpty()) return a.trim();
        if (b != null && !b.trim().isEmpty()) return b.trim();
        return null;
    }
}