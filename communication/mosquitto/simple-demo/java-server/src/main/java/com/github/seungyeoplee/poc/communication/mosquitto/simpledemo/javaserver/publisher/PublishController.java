package com.github.seungyeoplee.poc.communication.mosquitto.simpledemo.javaserver.publisher;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.seungyeoplee.poc.communication.mosquitto.simpledemo.javaserver.common.PayloadMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
@RequiredArgsConstructor
public class PublishController {

    private final ObjectMapper objectMapper;
    private final PublishGateway publishGateway;

    @PostMapping("/publish")
    public void publishMessage() throws JsonProcessingException {
        PayloadMessage message = new PayloadMessage(
                "from java server",
                System.currentTimeMillis(),
                true,
                "Hello from Java MQTT!".getBytes(StandardCharsets.UTF_8)
        );

        publishGateway.sendToMqtt(objectMapper.writeValueAsString(message));
    }
}
