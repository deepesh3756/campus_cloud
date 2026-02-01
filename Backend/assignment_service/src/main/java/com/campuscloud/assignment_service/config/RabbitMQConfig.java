package com.campuscloud.assignment_service.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Exchange name - must match notification service
    public static final String ASSIGNMENT_EXCHANGE = "assignment.exchange";

    // Routing key - must match notification service
    public static final String ASSIGNMENT_CREATED_ROUTING_KEY = "assignment.created";

    /**
     * Create the topic exchange
     */
    @Bean
    public TopicExchange assignmentExchange() {
        return new TopicExchange(ASSIGNMENT_EXCHANGE);
    }

    /**
     * JSON message converter with Java 8 date/time support
     */
    @Bean
    public MessageConverter messageConverter() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        return new Jackson2JsonMessageConverter(objectMapper);
    }
}
