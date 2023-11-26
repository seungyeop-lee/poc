package com.example.loginfront.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginForwardService {

    private final RestClient restClient;

    public String requestLogin(String id) {
        log.debug("id: {}", id);
        Map<String, String> result = restClient.post()
                .uri("/login/request")
                .contentType(APPLICATION_JSON)
                .body(Map.of("id", id))
                .retrieve()
                .body(Map.class);
        log.debug("response: {}", result);

        return result.get("uuid");
    }

    public String confirmLogin(String uuid) {
        log.debug("uuid: {}", uuid);
        Map<String, String> result = restClient.post()
                .uri("/login/confirm")
                .contentType(APPLICATION_JSON)
                .body(Map.of("uuid", uuid))
                .retrieve()
                .body(Map.class);
        log.debug("response: {}", result);
        if (result.get("approval").equals("true")) {
            return result.get("id");
        } else {
            return null;
        }
    }
}
