package com.example.loginfront.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
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

    public boolean confirmLogin(String uuid) {
        log.debug("uuid: {}", uuid);
        ResponseEntity<Void> response = restClient.post()
                .uri("/login/confirm")
                .contentType(APPLICATION_JSON)
                .body(Map.of("uuid", uuid))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {})
                .toBodilessEntity();
        log.debug("response: {}", response);
        return response.getStatusCode().is2xxSuccessful();
    }

}
