package example.server.config;

import example.server.app.user.UserService;
import example.server.config.auth.common.LoginSuccessHandler;
import example.server.config.auth.jwt.JWTFilter;
import example.server.config.auth.local.LocalAuthenticationProvider;
import example.server.config.auth.oauth2.MyOAuth2UserService;
import example.server.helper.jwt.JWTHelperManager;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Value("${service.oauth2.loginFailUrl}")
    private String loginFailUrl;

    private final MyOAuth2UserService oAuth2UserService;
    private final LoginSuccessHandler loginSuccessHandler;
    private final JWTHelperManager jwtHelperManager;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        disableDefaultSecurity(http);
        configCors(http);

        http.authorizeHttpRequests(c -> c
                .requestMatchers("/user/my", "/auth/token/info").authenticated()
                .anyRequest().permitAll()
        );

        http.oauth2Login(c -> c
                .userInfoEndpoint(ec -> ec
                        .userService(oAuth2UserService)
                )
                .successHandler(loginSuccessHandler)
                .failureHandler((request, response, exception) -> response.sendRedirect(loginFailUrl))
        );

        http.formLogin(c -> c
                .loginProcessingUrl("/user/login")
                .usernameParameter("email")
                .successHandler(loginSuccessHandler)
                // 로그인 실패 시 리다이렉션 방지
                .failureHandler((request, response, exception) -> response.sendRedirect(loginFailUrl))
        );

        http.addFilterAfter(new JWTFilter(jwtHelperManager), OAuth2LoginAuthenticationFilter.class);

        http.exceptionHandling(e -> e
                // 인증되지 않은 사용자의 요청 처리
                .authenticationEntryPoint((request, response, authException) -> response.setStatus(HttpServletResponse.SC_UNAUTHORIZED))
                // 인가되지 않은 사용자의 요청 처리
                .accessDeniedHandler((request, response, accessDeniedException) -> response.setStatus(HttpServletResponse.SC_FORBIDDEN))
        );

        return http.build();
    }

    private static void disableDefaultSecurity(HttpSecurity http) throws Exception {
        //csrf 비활성화
        http.csrf(AbstractHttpConfigurer::disable);

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

    @Bean
    public LocalAuthenticationProvider localAuthenticationProvider() {
        return new LocalAuthenticationProvider(userService, passwordEncoder);
    }
}
