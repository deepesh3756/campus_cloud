package com.campuscloud.users_service.security;

import java.io.IOException;
import java.time.Instant;
import java.time.OffsetDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletResponse;

public class ProblemDetailWriter {

    private static final ObjectMapper mapper = new ObjectMapper();

    public static void write(
            HttpServletResponse response,
            HttpStatus status,
            String type,
            String title,
            String detail
    ) throws IOException {

        ProblemDetail problem = ProblemDetail.forStatus(status);
        problem.setTitle(title);
        problem.setDetail(detail);
        problem.setProperty("type", type);
        problem.setProperty("timestamp", OffsetDateTime.now().toString());

        response.setStatus(status.value());
        response.setContentType("application/problem+json");
        response.getWriter().write(mapper.writeValueAsString(problem));
    }
}
