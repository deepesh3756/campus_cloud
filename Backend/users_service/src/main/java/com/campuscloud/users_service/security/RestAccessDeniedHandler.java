package com.campuscloud.users_service.security;

import java.io.IOException;
import java.time.OffsetDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import com.campuscloud.users_service.dto.ApiResponse;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class RestAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException ex
    ) throws IOException {

        ProblemDetail problem =
                ProblemDetail.forStatus(HttpStatus.FORBIDDEN);

        problem.setTitle("Forbidden");
        problem.setDetail("You do not have permission to access this resource");
        problem.setProperty("path", request.getRequestURI());
        problem.setProperty("timestamp", OffsetDateTime.now().toString());

        response.setStatus(403);
        response.setContentType("application/json");
        response.getWriter().write(mapper.writeValueAsString(ApiResponse.error(problem.getDetail(), problem)));
    }
}
