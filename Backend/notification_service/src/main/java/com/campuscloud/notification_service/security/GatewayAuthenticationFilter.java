package com.campuscloud.notification_service.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Filter to extract authentication information from gateway headers
 */
@Component
public class GatewayAuthenticationFilter extends OncePerRequestFilter {

    public static final String HEADER_GATEWAY_AUTH = "X-Gateway-Auth";
    public static final String HEADER_AUTH_USERNAME = "X-Auth-Username";
    public static final String HEADER_AUTH_ROLES = "X-Auth-Roles";

    @Value("${gateway.auth.secret:}")
    private String gatewayAuthSecret;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        String providedSecret = request.getHeader(HEADER_GATEWAY_AUTH);
        if (gatewayAuthSecret == null || gatewayAuthSecret.isBlank()
                || providedSecret == null || !gatewayAuthSecret.equals(providedSecret)) {
            filterChain.doFilter(request, response);
            return;
        }

        String username = request.getHeader(HEADER_AUTH_USERNAME);
        if (username == null || username.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        String rolesHeader = request.getHeader(HEADER_AUTH_ROLES);
        if (rolesHeader != null && !rolesHeader.isBlank()) {
            for (String raw : rolesHeader.split(",")) {
                String role = raw.trim();
                if (role.isEmpty()) {
                    continue;
                }
                if (role.startsWith("ROLE_")) {
                    authorities.add(new SimpleGrantedAuthority(role));
                } else {
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                }
            }
        }

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null,
                authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}
