package com.campuscloud.users_service.security;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RefreshCsrfFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        if (!"POST".equals(request.getMethod()) ||
           !(path.startsWith("/api/users/refresh-token") ||
             path.startsWith("/api/users/logout"))) {
            filterChain.doFilter(request, response);
            return;
        }

        String headerToken = request.getHeader("X-XSRF-TOKEN");
        String cookieToken = null;

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("XSRF-TOKEN".equals(cookie.getName())) {
                    cookieToken = cookie.getValue();
                }
            }
        }

        if (headerToken == null || cookieToken == null
                || !headerToken.equals(cookieToken)) {

        	if (response.isCommitted()) {
        	    return;
        	}

            if (!response.isCommitted()) {
                ProblemDetailWriter.write(
                    response,
                    HttpStatus.FORBIDDEN,
                    "https://campuscloud/errors/csrf",
                    "CSRF validation failed",
                    "Invalid or missing CSRF token"
                );
            }
            return;
        }

        filterChain.doFilter(request, response);
    }
}

