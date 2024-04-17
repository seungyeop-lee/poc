package poc.java.springsecurity.sessionidinheader.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.MapSessionRepository;
import org.springframework.session.config.annotation.web.http.EnableSpringHttpSession;
import org.springframework.session.web.http.HeaderHttpSessionIdResolver;
import org.springframework.session.web.http.HttpSessionIdResolver;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
@EnableSpringHttpSession
public class SessionConfig {
    @Bean
    public HttpSessionIdResolver httpSessionIdResolver() {
        return new HeaderHttpSessionIdResolver("X-Session-Id");
    }

    @Bean
    public MapSessionRepository sessionRepository() {
        MapSessionRepository mapSessionRepository = new MapSessionRepository(new ConcurrentHashMap<>());
        mapSessionRepository.setDefaultMaxInactiveInterval(Duration.ofMinutes(1)); //세션 유효시간 설정
        return mapSessionRepository;
    }
}
