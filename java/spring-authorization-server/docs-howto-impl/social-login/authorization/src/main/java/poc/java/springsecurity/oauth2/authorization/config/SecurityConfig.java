package poc.java.springsecurity.oauth2.authorization.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(c -> c
                .anyRequest().authenticated()
        );

        FederatedIdentityAuthenticationSuccessHandler successHandler = new FederatedIdentityAuthenticationSuccessHandler();
        successHandler.setOAuth2UserHandler(new UserRepositoryOAuth2UserHandler());

        // OAuth2 Login handles the redirect to the OAuth 2.0 Login endpoint from the authorization server filter chain
        http.oauth2Login(c -> c.
                successHandler(successHandler)
        );

        return http.build();
    }
}
