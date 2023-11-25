package com.example.loginfront.config.authentication;

import org.springframework.security.core.AuthenticationException;

public class NotFinishLoginProcessException extends AuthenticationException {
    public NotFinishLoginProcessException(String msg) {
        super(msg);
    }
}
