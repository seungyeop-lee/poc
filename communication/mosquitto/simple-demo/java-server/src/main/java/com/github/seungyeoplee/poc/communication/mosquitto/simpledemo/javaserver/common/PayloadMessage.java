
package com.github.seungyeoplee.poc.communication.mosquitto.simpledemo.javaserver.common;

public record PayloadMessage(
        String name,
        long currentTime,
        boolean enable,
        byte[] data
) {
}