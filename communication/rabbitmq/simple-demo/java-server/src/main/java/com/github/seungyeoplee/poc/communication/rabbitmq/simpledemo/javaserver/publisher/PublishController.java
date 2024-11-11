package com.github.seungyeoplee.poc.communication.rabbitmq.simpledemo.javaserver.publisher;

import com.github.seungyeoplee.poc.communication.rabbitmq.simpledemo.javaserver.common.Values;
import com.github.seungyeoplee.poc.communication.rabbitmq.simpledemo.javaserver.common.PayloadMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
@RequiredArgsConstructor
public class PublishController {

    private final RabbitTemplate rabbitTemplate;

    @PostMapping("/publish")
    public void publishMessage() {
        rabbitTemplate.convertAndSend(
                Values.EXCHANGE_NAME,
                "poc.communication.rabbitmq.java",
                new PayloadMessage(
                        "from java server",
                        System.currentTimeMillis(),
                        true,
                        "Hello from Java RabbitMQ!".getBytes(StandardCharsets.UTF_8)
                )
        );
    }
}
