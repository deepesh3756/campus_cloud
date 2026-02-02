package com.campuscloud.notification_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Exchange name
    public static final String ASSIGNMENT_EXCHANGE = "assignment.exchange";

    // Queue name
    public static final String ASSIGNMENT_NOTIFICATION_QUEUE = "assignment.notification.queue";

    // Routing key
    public static final String ASSIGNMENT_CREATED_ROUTING_KEY = "assignment.created";

    /**
     * Create the topic exchange
     */
    @Bean
    public TopicExchange assignmentExchange() {
        return new TopicExchange(ASSIGNMENT_EXCHANGE);
    }

    /**
     * Create the queue for notifications
     */
    @Bean
    public Queue assignmentNotificationQueue() {
        return new Queue(ASSIGNMENT_NOTIFICATION_QUEUE, true); // durable = true
    }

    /**
     * Bind the queue to the exchange with routing key
     */
    @Bean
    public Binding assignmentNotificationBinding(Queue assignmentNotificationQueue,
            TopicExchange assignmentExchange) {
        return BindingBuilder
                .bind(assignmentNotificationQueue)
                .to(assignmentExchange)
                .with(ASSIGNMENT_CREATED_ROUTING_KEY);
    }

    /**
     * JSON message converter for serialization/deserialization
     */
    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    /**
     * RabbitTemplate with JSON converter
     */
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
