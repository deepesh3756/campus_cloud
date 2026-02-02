package com.campuscloud.assignment_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AssignmentServiceApplication {
	
    public static void main(String[] args) {
        SpringApplication.run(AssignmentServiceApplication.class, args);
        System.out.println("======================================");
        System.out.println("Assignment Service Started Successfully!");
        System.out.println("Port: 8083");
        System.out.println("Swagger UI: http://localhost:8083/swagger-ui.html");
        System.out.println("======================================");
        
    }
}
