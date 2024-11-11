
package com.github.seungyeoplee.poc.communication.rabbitmq.simpledemo.javaserver.common;

/**
 * 참고!
 * <p></p>
 * SimpleMessageConverter를 사용시
 * RabbitMQ의 메세지 페이로드는 record 사용 불가!
 * Serializable 인터페이스를 구현해야한다.
 * <p></p>
 * Jackson2JsonMessageConverter를 사용하면 record 사용 가능
 */
public record PayloadMessage(
        String name,
        long currentTime,
        boolean enable,
        byte[] data
) {
}
