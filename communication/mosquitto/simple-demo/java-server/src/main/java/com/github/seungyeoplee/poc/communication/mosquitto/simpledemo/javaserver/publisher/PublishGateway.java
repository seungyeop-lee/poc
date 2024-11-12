package com.github.seungyeoplee.poc.communication.mosquitto.simpledemo.javaserver.publisher;

import org.springframework.integration.annotation.MessagingGateway;

@MessagingGateway(defaultRequestChannel = "mqttOutboundChannel")
public interface PublishGateway {
    void sendToMqtt(String data);
}
