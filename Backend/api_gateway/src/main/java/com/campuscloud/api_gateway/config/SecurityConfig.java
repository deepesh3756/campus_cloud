package com.campuscloud.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        http
            .csrf(ServerHttpSecurity.CsrfSpec::disable) // CSRF wired later

            .authorizeExchange(exchanges -> exchanges
                // Public auth endpoints
                .pathMatchers(
                    "/api/users/login",
                    "/api/users/register/**",
                    "/api/users/refresh-token",
                    "/api/users/logout"
                ).permitAll()

                // Actuator
                .pathMatchers("/actuator/**").permitAll()

                // Everything else requires JWT
                .anyExchange().authenticated()
            )

            // JWT validation
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());

        return http.build();
    }
}
