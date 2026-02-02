package com.campuscloud.users_service.exception;

import java.time.OffsetDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.campuscloud.users_service.dto.ApiResponse;

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
    public ResponseEntity<ApiResponse<ProblemDetail>> handleRuntime(
            RuntimeException ex,
            HttpServletRequest request
    ) {
        ProblemDetail problem = baseProblem(
            HttpStatus.BAD_REQUEST,
            "Bad request",
            ex.getMessage(),
            request
        );

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(problem.getDetail(), problem));
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ApiResponse<ProblemDetail>> handleSecurity(
            SecurityException ex,
            HttpServletRequest request
    ) {
        ProblemDetail problem = baseProblem(
            HttpStatus.FORBIDDEN,
            "Access denied",
            ex.getMessage(),
            request
        );

        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(ApiResponse.error(problem.getDetail(), problem));
    }
    
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiResponse<ProblemDetail>> handleDisabled(
            DisabledException ex,
            HttpServletRequest request
    ) {
        ProblemDetail problem = baseProblem(
            HttpStatus.FORBIDDEN,
            "Forbidden",
            "Your account is inactive. Contact admin.",
            request
        );
        problem.setProperty("error", "ACCOUNT_DISABLED");

        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(ApiResponse.error(problem.getDetail(), problem));
    }

}
