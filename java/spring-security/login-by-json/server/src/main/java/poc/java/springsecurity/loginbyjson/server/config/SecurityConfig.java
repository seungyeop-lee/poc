package poc.java.springsecurity.loginbyjson.server.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(c -> c
                .anyRequest().authenticated()
        );

        http.csrf(AbstractHttpConfigurer::disable);
        http.formLogin(AbstractHttpConfigurer::disable);

        http.with(new JsonLoginConfigurer<>(), c -> c
                // 로그인 완료 시 리다이렉션 방지
                .successHandler((request, response, authentication) -> {
                    response.setStatus(HttpServletResponse.SC_OK);
                })
                // 로그인 실패 시 리다이렉션 방지
                .failureHandler((request, response, exception) -> {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                })
        );

        http.exceptionHandling(e -> e
                // 인증되지 않은 사용자의 요청 처리
                .authenticationEntryPoint((request, response, authException) -> response.setStatus(HttpServletResponse.SC_UNAUTHORIZED))
                // 인가되지 않은 사용자의 요청 처리
                .accessDeniedHandler((request, response, accessDeniedException) -> response.setStatus(HttpServletResponse.SC_FORBIDDEN))
        );

        return http.build();
    }
}
