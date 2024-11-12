package com.github.seungyeoplee.poc.communication.mosquitto.simpledemo.javaserver.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.seungyeoplee.poc.communication.mosquitto.simpledemo.javaserver.common.PayloadMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MqttListener implements MessageHandler {

    private final ObjectMapper mapper;

    @Override
    @ServiceActivator(inputChannel = "mqttInboundChannel")
    public void handleMessage(Message<?> message) throws MessagingException {
        String payload = (String) message.getPayload();
        try {
            PayloadMessage payloadMessage = mapper.readValue(payload, PayloadMessage.class);
            log.info("Received message: {}", payloadMessage);
            log.info("Received message Data: {}", new String(payloadMessage.data()));
            log.info("Received RoutingKey: {}", message.getHeaders().get("mqtt_receivedTopic"));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
