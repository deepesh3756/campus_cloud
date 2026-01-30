package com.campuscloud.users_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.campuscloud.users_service.security.GatewayAuthenticationFilter;
import com.campuscloud.users_service.security.GatewayOnlyAccessFilter;
import com.campuscloud.users_service.security.RefreshCsrfFilter;
import com.campuscloud.users_service.security.RestAccessDeniedHandler;
import com.campuscloud.users_service.security.RestAuthEntryPoint;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final GatewayOnlyAccessFilter gatewayOnlyAccessFilter;
	private final GatewayAuthenticationFilter gatewayAuthenticationFilter;
	private final RefreshCsrfFilter refreshCsrfFilter;
    
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception 
	{
	    http
	        .csrf(csrf -> csrf.disable())

	        // 🔴 THIS IS THE KEY FIX
	        .anonymous(anonymous -> anonymous.disable())

	        .sessionManagement(session ->
	            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
	        )
	        .authorizeHttpRequests(auth -> auth
	            .requestMatchers("/actuator/**").permitAll()
	            .requestMatchers(
	                "/v3/api-docs/**",
	                "/swagger-ui/**",
	                "/swagger-ui.html"
	            ).permitAll()
	            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
	            .requestMatchers(
	                "/api/users/login",
	                "/api/users/refresh-token",
	                "/api/users/logout"
	            ).permitAll()

	            // 🔐 admin endpoints
	            .requestMatchers("/admin/**").authenticated()
	            .requestMatchers("/admin/**").hasRole("ADMIN")

	            .anyRequest().authenticated()
	        )
	        .exceptionHandling(ex -> ex
	            .authenticationEntryPoint(new RestAuthEntryPoint())
	            .accessDeniedHandler(new RestAccessDeniedHandler())
	        )
	        .addFilterBefore(
	            gatewayOnlyAccessFilter,
	            UsernamePasswordAuthenticationFilter.class
	        )
	        .addFilterBefore(
	            refreshCsrfFilter,
	            UsernamePasswordAuthenticationFilter.class
	        )
	        .addFilterBefore(
	            gatewayAuthenticationFilter,
	            UsernamePasswordAuthenticationFilter.class
	        );

	    return http.build();
	}

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}
