package com.github.seungyeoplee.poc.communication.rabbitmq.simpledemo.javaserver.consumer;

import com.github.seungyeoplee.poc.communication.rabbitmq.simpledemo.javaserver.common.PayloadMessage;
import com.github.seungyeoplee.poc.communication.rabbitmq.simpledemo.javaserver.common.Values;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.ExchangeTypes;
import org.springframework.amqp.rabbit.annotation.*;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class RabbitMqListener {

    private static final String QUEUE_NAME = "java-server";

    @RabbitListener(
            bindings = @QueueBinding(
                    exchange = @Exchange(value = Values.EXCHANGE_NAME, type = ExchangeTypes.TOPIC),
                    value = @Queue(value = QUEUE_NAME, durable = "true"),
                    key = "poc.communication.rabbitmq.#"
            )
    )
    public void receiveMessage(PayloadMessage message, @Header("amqp_receivedRoutingKey") String routingKey) {
        log.info("Received Message: {}", message);
        log.info("Received Message Data: {}", new String(message.data()));
        log.info("Received RoutingKey: {}", routingKey);
    }
}
