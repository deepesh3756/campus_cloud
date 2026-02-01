package com.campuscloud.assignment_service.event;

import com.campuscloud.assignment_service.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

/**
 * Service for publishing events to RabbitMQ
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EventPublisher {

    private final RabbitTemplate rabbitTemplate;

    /**
     * Publish assignment created event
     */
    public void publishAssignmentCreated(AssignmentCreatedEvent event) {
        try {
            log.info("Publishing assignment created event: {}", event);
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.ASSIGNMENT_EXCHANGE,
                    RabbitMQConfig.ASSIGNMENT_CREATED_ROUTING_KEY,
                    event);
            log.info("Successfully published event for assignment: {}", event.getAssignmentId());
        } catch (Exception e) {
            log.error("Failed to publish assignment created event", e);
            // Don't throw exception - event publishing failure shouldn't break assignment
            // creation
        }
    }
}
