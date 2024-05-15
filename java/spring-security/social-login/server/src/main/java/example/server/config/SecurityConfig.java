package example.server.config;

import example.server.config.auth.jwt.JWTFilter;
import example.server.config.auth.jwt.JWTUtil;
import example.server.config.auth.oauth2.MyOAuth2LoginSuccessHandler;
import example.server.config.auth.oauth2.MyOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JWTUtil jwtUtil;
    private final MyOAuth2UserService oAuth2UserService;
    private final MyOAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        disableDefaultSecurity(http);
        configCors(http);

        http.authorizeHttpRequests(c -> c
                .requestMatchers("/user/**").authenticated()
                .anyRequest().permitAll()
        );

        http.oauth2Login(c -> c
                .userInfoEndpoint(ec -> ec
                        .userService(oAuth2UserService)
                )
                .successHandler(oAuth2LoginSuccessHandler)
        );

        http.addFilterAfter(new JWTFilter(jwtUtil), OAuth2LoginAuthenticationFilter.class);

        return http.build();
    }

    private static void disableDefaultSecurity(HttpSecurity http) throws Exception {
        //csrf 비활성화
        http.csrf(AbstractHttpConfigurer::disable);

        //From 로그인 방식 비활성화
        http.formLogin(AbstractHttpConfigurer::disable);

        //HTTP Basic 인증 방식 비활성화
        http.httpBasic(AbstractHttpConfigurer::disable);

        //세션 비활성화
        http.sessionManagement(c -> c
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        // h2 console 사용을 위한 설정
        http.headers(c -> c.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable));
    }

    private static void configCors(HttpSecurity http) throws Exception {
        http.cors(corsCustomizer -> corsCustomizer.configurationSource(request -> {
            CorsConfiguration configuration = new CorsConfiguration();

            configuration.addAllowedOriginPattern("*");
            configuration.setAllowedMethods(Collections.singletonList("*"));
            configuration.setAllowCredentials(true);
            configuration.setAllowedHeaders(Collections.singletonList("*"));
            configuration.setMaxAge(3600L);

            configuration.setExposedHeaders(Collections.singletonList("*"));

            return configuration;
        }));
    }
}
