package com.example.loginback.login;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.util.UUID;

@Getter
@EqualsAndHashCode
@AllArgsConstructor
public class Login {
    private String uuid;
    private String id;
    private Boolean approval;

    public static Login request(String id) {
        return new Login(
                UUID.randomUUID().toString(),
                id,
                false
        );
    }

    public void approveLogin() {
        approval = true;
    }
}
