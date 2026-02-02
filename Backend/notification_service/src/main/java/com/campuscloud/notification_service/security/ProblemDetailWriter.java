package com.campuscloud.notification_service.security;

import java.io.IOException;
import java.time.OffsetDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.campuscloud.notification_service.dto.ApiResponse;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Utility class to write standardized problem details to HTTP responses
 */
public class ProblemDetailWriter {

    private static final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    public static void write(
            HttpServletResponse response,
            HttpStatus status,
            String type,
            String title,
            String detail) throws IOException {

        ProblemDetail problem = ProblemDetail.forStatus(status);
        problem.setTitle(title);
        problem.setDetail(detail);
        problem.setProperty("type", type);
        problem.setProperty("timestamp", OffsetDateTime.now().toString());

        response.setStatus(status.value());
        response.setContentType("application/json");
        response.getWriter().write(mapper.writeValueAsString(ApiResponse.error(detail, problem)));
    }
}
