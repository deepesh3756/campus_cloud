package com.campuscloud.users_service.exception;

import java.time.Instant;
import java.time.OffsetDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ProblemDetail baseProblem(
            HttpStatus status,
            String title,
            String detail,
            HttpServletRequest request
    ) {
        ProblemDetail problem = ProblemDetail.forStatus(status);
        problem.setTitle(title);
        problem.setDetail(detail);
        problem.setProperty("path", request.getRequestURI());
        problem.setProperty("timestamp", OffsetDateTime.now().toString());
        return problem;
    }

    @ExceptionHandler(RuntimeException.class)
    public ProblemDetail handleRuntime(
            RuntimeException ex,
            HttpServletRequest request
    ) {
        return baseProblem(
                HttpStatus.BAD_REQUEST,
                "Bad request",
                ex.getMessage(),
                request
        );
    }

    @ExceptionHandler(SecurityException.class)
    public ProblemDetail handleSecurity(
            SecurityException ex,
            HttpServletRequest request
    ) {
        return baseProblem(
                HttpStatus.FORBIDDEN,
                "Access denied",
                ex.getMessage(),
                request
        );
    }
}
