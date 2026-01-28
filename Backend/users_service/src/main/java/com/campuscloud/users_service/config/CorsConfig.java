package com.campuscloud.users_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // 🔴 CHANGE THIS to your frontend URL
        /*
        config.setAllowedOrigins(List.of(
            "http://localhost:3000"
        ));
        */
        
        config.setAllowedOriginPatterns(List.of(
    	    "http://localhost:3000"        	
		));

        config.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of(
		    "Authorization",
		    "Content-Type",
		    "X-XSRF-TOKEN" // 🔥 REQUIRED for CSRF
		));


        // ⭐ REQUIRED for cookies (refresh token)
        config.setAllowCredentials(true);

        // Optional but useful
        config.setExposedHeaders(List.of(
            "Set-Cookie"
        ));

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        // Apply to ALL endpoints
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
