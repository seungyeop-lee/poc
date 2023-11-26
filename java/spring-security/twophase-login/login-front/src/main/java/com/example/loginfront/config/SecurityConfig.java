package com.example.loginfront.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(c -> c
                .requestMatchers("/resources/**", "/static/**", "/public/**").permitAll()
                .requestMatchers("/member/login", "/member/login-fail", "/member/login/request").permitAll()
                .anyRequest().authenticated()
        );

        http.formLogin(c -> c
                .loginPage("/member/login")
                .usernameParameter("uuid")
                .failureUrl("/member/login-fail")
                .defaultSuccessUrl("/main")
        );

        http.logout(c -> c
                .logoutRequestMatcher(new AntPathRequestMatcher("/member/logout", "GET"))
                .logoutSuccessUrl("/")
        );

        http.sessionManagement(c -> c
                .sessionFixation(sf -> sf
                        .changeSessionId() //로그인 시 동일한 세션에 대한 id 변경
                )
                // authentication의 principle의 값이 중복되는지 확인해서 session 관리를 하는 것으로 보임
                .sessionConcurrency(sc -> sc
                        .maximumSessions(1) //사용자 당 최대 몇 session까지 허용하는지 설정
                        .maxSessionsPreventsLogin(false) //true면 로그인 금지, false면 로그인 가능 그러나 그 전 session은 만료
                        .expiredUrl("/member/login") //session 만료되었을 때 redirect url
                )
        );

        return http.build();
    }
}
