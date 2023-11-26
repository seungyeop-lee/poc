package com.example.loginfront.config.authentication;

import com.example.loginfront.service.LoginForwardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import java.util.List;

/*
AuthenticationProvider를 구현하고 있는 구현체를 빈으로 등록할 경우
자동으로 AuthenticationProvider로서 등록된다.
bean인데 security config에서 등록을 다시하면 2중 등록 된다.
이 경우 bean으로 등록한 것이 parent가 된다.
*/
@Slf4j
@Component
@RequiredArgsConstructor
public class ForwardAuthenticationProvider implements AuthenticationProvider {

    private final LoginForwardService loginForwardService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        log.debug("authentication: {}", authentication);
        String uuid = (String) authentication.getPrincipal();
        String id = loginForwardService.confirmLogin(uuid);
        log.debug("id: {}", id);
        if (id != null) {
            return UsernamePasswordAuthenticationToken.authenticated(id, null, List.of());
        } else {
            throw new NotFinishLoginProcessException("not yet approval");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
