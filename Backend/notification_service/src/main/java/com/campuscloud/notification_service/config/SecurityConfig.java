package com.campuscloud.notification_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.campuscloud.notification_service.security.GatewayAuthenticationFilter;
import com.campuscloud.notification_service.security.GatewayOnlyAccessFilter;

import lombok.RequiredArgsConstructor;

/**
 * Security configuration for notification service
 */
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final GatewayOnlyAccessFilter gatewayOnlyAccessFilter;
    private final GatewayAuthenticationFilter gatewayAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html")
                        .permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // WebSocket endpoint
                        .requestMatchers("/ws/**").permitAll()

                        // All other requests require authentication
                        .anyRequest().authenticated())
                .addFilterBefore(
                        gatewayOnlyAccessFilter,
                        UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(
                        gatewayAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
