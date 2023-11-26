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

        return http.build();
    }
}
