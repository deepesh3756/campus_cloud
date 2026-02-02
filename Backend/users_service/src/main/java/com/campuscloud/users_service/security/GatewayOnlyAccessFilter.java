package com.campuscloud.users_service.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class GatewayOnlyAccessFilter extends OncePerRequestFilter {

    @Value("${gateway.auth.secret:}")
    private String gatewayAuthSecret;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        if (path == null) {
            return false;
        }

        return path.startsWith("/actuator/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if (gatewayAuthSecret == null || gatewayAuthSecret.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        String providedSecret = request.getHeader(GatewayAuthenticationFilter.HEADER_GATEWAY_AUTH);
        if (providedSecret == null || !gatewayAuthSecret.equals(providedSecret)) {
            if (!response.isCommitted()) {
                ProblemDetailWriter.write(
                        response,
                        HttpStatus.FORBIDDEN,
                        "https://campuscloud/errors/gateway-only",
                        "Forbidden",
                        "Direct access is not allowed. Please access this service through the API Gateway."
                );
            }
            return;
        }

        filterChain.doFilter(request, response);
    }
}
