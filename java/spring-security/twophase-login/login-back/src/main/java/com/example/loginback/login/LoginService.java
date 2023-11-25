package com.example.loginback.login;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class LoginService {

    private static final Map<String, Login> requestRepo = new HashMap<>();

    public String request(String id) {
        log.debug("request id: {}", id);
        Login loginRequest = Login.request(id);
        String uuid = loginRequest.getUuid();
        requestRepo.put(uuid, loginRequest);
        log.debug("request uuid: {}", uuid);
        return uuid;
    }

    public void approve(String uuid) {
        log.debug("approve uuid: {}", uuid);
        Login login = requestRepo.get(uuid);
        login.approveLogin();
    }

    public boolean confirm(String uuid) {
        log.debug("confirm uuid: {}", uuid);
        Login login = requestRepo.get(uuid);
        Boolean approval = login.getApproval();
        if (approval) {
            requestRepo.remove(uuid);
        }
        log.debug("confirm approval: {}", approval);
        return approval;
    }
}
